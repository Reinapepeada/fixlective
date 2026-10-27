import { Router } from 'express';
import { sql } from '../config/db.js';
const router = Router();
const definitions = {
  'failure-cases': { table: 'failure_cases', fields: ['brand','model_commercial','model_number','symptom','current_draw','equipment_status','author'], required: ['brand','model_commercial','symptom'], search: true },
  causes: { table: 'causes', fields: ['case_id','component_or_zone','description','is_confirmed','result_post'], required: ['case_id','component_or_zone'] },
  measurements: { table: 'measurements', fields: ['cause_id','point_or_line','type','powered','fault_value','unit','normal_value'], required: ['cause_id','point_or_line','type','fault_value'] },
  confirmations: { table: 'confirmations', fields: ['case_id','type','user_id'], required: ['case_id','type'] }
};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const allowedTypes = ['also_happened','solution_confirmed'];
const measurementTypes = ['diode','voltage','current','resistance'];
const handle = fn => async (req,res,next) => { try { await fn(req,res); } catch(e) { next(e); } };
for (const [resource, config] of Object.entries(definitions)) {
  const {table,fields,required}=config;
  const base = '/' + resource;
  const validate = (body, create) => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Se requiere un objeto JSON';
    if (Object.keys(body).some(k => !fields.includes(k))) return 'Campos desconocidos o de solo lectura';
    if (!create && !Object.keys(body).length) return 'No hay campos para actualizar';
    if (create && required.some(k => body[k] == null || body[k] === '')) return 'Faltan campos obligatorios';
    for (const [key,value] of Object.entries(body)) {
      if (value === null) { if (required.includes(key)) return key + ' no puede ser null'; continue; }
      if (['is_confirmed','powered'].includes(key)) { if (typeof value !== 'boolean') return key + ' debe ser booleano'; continue; }
      if (typeof value !== 'string') return key + ' debe ser texto';
      const limits = {brand:50,model_commercial:100,model_number:50,symptom:150,current_draw:100,equipment_status:50,author:100,component_or_zone:100,result_post:50,point_or_line:100,type:50,fault_value:50,unit:20,normal_value:50,user_id:100};
      if (limits[key] && value.length > limits[key]) return key + ' excede el máximo de caracteres';
      if (required.includes(key) && !value.trim()) return key + ' no puede estar vacío';
      if (['case_id','cause_id'].includes(key) && !uuid.test(value)) return key + ' debe ser UUID';
    }
    if (resource === 'confirmations' && body.type !== undefined && !allowedTypes.includes(body.type)) return 'Tipo de confirmación inválido';
    if (resource === 'measurements' && body.type !== undefined && !measurementTypes.includes(body.type)) return 'Tipo de medición inválido';
    return null;
  };
  router.get(base,handle(async(req,res)=>{
    const limit=Math.min(Math.max(Number.parseInt(req.query.limit,10)||20,1),100);
    const offset=Math.max(Number.parseInt(req.query.offset,10)||0,0);
    const filters=[];
    for(const field of ['case_id','cause_id']) if(req.query[field] !== undefined) {
      if(!fields.includes(field) || !uuid.test(req.query[field])) return res.status(400).json({error:'Filtro inválido: '+field});
      filters.push(sql`${sql(field)} = ${req.query[field]}`);
    }
    if(config.search && req.query.q) filters.push(sql`(model_commercial ILIKE ${'%'+req.query.q+'%'} OR symptom ILIKE ${'%'+req.query.q+'%'})`);
    const where=filters.length ? sql`WHERE ${filters.reduce((a,b)=>sql`${a} AND ${b}`)}` : sql``;
    const rows=await sql`SELECT * FROM ${sql(table)} ${where} ORDER BY ${sql(table==='failure_cases'||table==='confirmations'?'created_at':'id')} DESC LIMIT ${limit} OFFSET ${offset}`;
    res.json({data:rows,limit,offset});
  }));
  router.get(base+'/:id',handle(async(req,res)=>{
    if(!uuid.test(req.params.id)) return res.status(400).json({error:'UUID inválido'});
    const rows=await sql`SELECT * FROM ${sql(table)} WHERE id=${req.params.id}`;
    if(!rows.length) return res.status(404).json({error:'No encontrado'});
    res.json(rows[0]);
  }));
  router.post(base,handle(async(req,res)=>{
    const error=validate(req.body,true);if(error)return res.status(400).json({error});
    const keys=Object.keys(req.body);
    const rows=await sql`INSERT INTO ${sql(table)} ${sql(req.body, ...keys)} RETURNING *`;
    res.status(201).json(rows[0]);
  }));
  router.patch(base+'/:id',handle(async(req,res)=>{
    if(!uuid.test(req.params.id))return res.status(400).json({error:'UUID inválido'});
    const error=validate(req.body,false);if(error)return res.status(400).json({error});
    const rows=await sql`UPDATE ${sql(table)} SET ${sql(req.body,...Object.keys(req.body))} WHERE id=${req.params.id} RETURNING *`;
    if(!rows.length)return res.status(404).json({error:'No encontrado'});
    res.json(rows[0]);
  }));
  router.delete(base+'/:id',handle(async(req,res)=>{
    if(!uuid.test(req.params.id))return res.status(400).json({error:'UUID inválido'});
    const rows=await sql`DELETE FROM ${sql(table)} WHERE id=${req.params.id} RETURNING id`;
    if(!rows.length)return res.status(404).json({error:'No encontrado'});
    res.status(204).end();
  }));
}
export default router;
