import * as cases from '../models/failure-case.model.js';
import { findById as findModel } from '../models/device-model.model.js';
import { fail, textField, validateBody } from '../middlewares/validation.js';

async function requireCase(operation) {
  try {
    const item = await operation;
    if (item) return item;
  } catch (error) {
    if (error.code !== 'P2025') throw error;
  }
  fail(404, 'No se encontró el caso de falla.');
}

async function validated(body, partial = false) {
  validateBody(body, ['device_model_id', 'symptom', 'diagnosis', 'solution', 'status']);
  const data = {};
  if (!partial || 'device_model_id' in body) {
    data.device_model_id = textField(body, 'device_model_id', 'El modelo', 100, true);
    if (!(await findModel(data.device_model_id))) fail(400, 'Elegí un modelo de celular existente.');
  }
  if (!partial || 'symptom' in body) {
    data.symptom = textField(body, 'symptom', 'El síntoma', 500, true);
  }
  for (const [key, label] of [['diagnosis', 'El diagnóstico'], ['solution', 'La solución']]) {
    if (key in body) data[key] = textField(body, key, label, 2000);
  }
  if ('status' in body) {
    if (!['active', 'archived'].includes(body.status)) fail(400, 'El estado debe ser active o archived.');
    data.status = body.status;
  }
  return data;
}

export async function list(req, res) {
  const { deviceModelId } = req.query;
  if (deviceModelId !== undefined && (typeof deviceModelId !== 'string' || !deviceModelId.trim())) {
    fail(400, 'El filtro deviceModelId debe ser un ID de modelo.');
  }
  const data = await cases.findAll(deviceModelId);
  res.json({ status: 'ok', data });
}

export async function get(req, res) {
  const data = await requireCase(cases.findById(req.params.id));
  res.json({ status: 'ok', data });
}

export async function create(req, res) {
  const data = await cases.create(await validated(req.body));
  res.status(201).json({ status: 'ok', data });
}

export async function update(req, res) {
  const { id } = req.params;
  await requireCase(cases.findById(id));
  const data = await requireCase(cases.update(id, await validated(req.body, true)));
  res.json({ status: 'ok', data });
}

export async function remove(req, res) {
  const data = await requireCase(cases.remove(req.params.id));
  res.json({ status: 'ok', data });
}
