import { getPrisma } from '../src/lib/prisma.js';

const deviceModels = [
  { id: 'samsung-a52', brand: 'Samsung', name: 'Galaxy A52' },
  { id: 'apple-iphone-11', brand: 'Apple', name: 'iPhone 11' },
  { id: 'motorola-g60', brand: 'Motorola', name: 'Moto G60' },
];

const failureCases = [
  {
    id: 'example-restart',
    device_model_id: 'motorola-g60',
    symptom: 'Se reinicia de forma intermitente.',
    status: 'archived',
  },
  {
    id: 'example-display',
    device_model_id: 'apple-iphone-11',
    symptom: 'La pantalla permanece negra, pero el equipo vibra.',
    status: 'active',
  },
  {
    id: 'example-charge',
    device_model_id: 'samsung-a52',
    symptom: 'No reconoce el cargador al conectarlo.',
    status: 'active',
  },
];

let prisma;
try {
  prisma = getPrisma();

  await prisma.$transaction([
    ...deviceModels.map(({ id, ...fields }) =>
      prisma.deviceModel.upsert({ where: { id }, create: { id, ...fields }, update: {} })),
    ...failureCases.map(({ id, ...fields }) =>
      prisma.failureCase.upsert({ where: { id }, create: { id, ...fields }, update: {} })),
  ]);

  console.log(`Seed verificado: ${deviceModels.length} modelos y ${failureCases.length} casos de ejemplo.`);
} catch (error) {
  const code = error?.code ?? error?.errorCode;
  const detail = /^P\d{4}$/.test(code) ? ` (${code})` : '';
  console.error(`No se pudo cargar el seed de Fixlective${detail}. Verificá la conexión y la migración.`);
  process.exitCode = 1;
} finally {
  await prisma?.$disconnect();
}
