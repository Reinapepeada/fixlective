import express from 'express';
import cors from 'cors';
import routes from './routes/index.routes.js';
import crudRoutes from './routes/crud.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/api', crudRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === '23503') return res.status(422).json({error:'La referencia indicada no existe'});
  if (err.code === '23505') return res.status(409).json({error:'Registro duplicado'});
  if (err.code === '23514' || err.code === '22001' || err.code === '22P02') return res.status(400).json({error:'Datos inválidos'});
  res.status(500).json({error:'Error interno del servidor'});
});
export default app;
