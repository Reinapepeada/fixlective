import 'dotenv/config';
import { once } from 'node:events';
import app from './src/app.js';

const port = Number(process.env.PORT || 3000);
const host = process.env.RENDER === 'true' ? '0.0.0.0' : '127.0.0.1';

try {
  const server = app.listen(port, host);
  await once(server, 'listening');
  console.log(`Fixlective API escuchando en el puerto ${port}`);
} catch (error) {
  console.error('No se pudo iniciar Fixlective API:', error.message);
  process.exitCode = 1;
}
