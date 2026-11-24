import express from 'express';
import cors from 'cors';
import routes from './routes/index.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ status: 'error', data: { message: 'No se encontró esa ruta.' } });
});

const databaseErrors = new Map([
  ['P2002', { status: 409, message: 'Ya existe un modelo con esa marca y nombre.' }],
  ['P2003', { status: 400, message: 'Elegí un modelo de celular existente.' }],
  ['P2025', { status: 404, message: 'No se encontró el registro.' }],
]);

app.use((error, _req, res, _next) => {
  const databaseError = databaseErrors.get(error.code);
  const status = databaseError?.status ?? error.status ?? 500;
  let message = databaseError?.message ?? error.message;
  if (error.type === 'entity.parse.failed') message = 'El cuerpo debe ser JSON válido.';
  if (status >= 500) {
    const code = /^P\d{4}$/.test(error.code) ? ` (${error.code})` : '';
    console.error(`Error interno al procesar la solicitud${code}.`);
    message = 'No se pudo completar la operación. Intentá de nuevo.';
  }
  res.status(status).json({ status: 'error', data: { message } });
});

export default app;
