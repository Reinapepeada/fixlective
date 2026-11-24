import { DatabaseConfigurationError, getPrisma } from '../src/lib/prisma.js';

try {
  const prisma = getPrisma();
  try {
    await prisma.$queryRaw`SELECT 1`;
  } finally {
    await prisma.$disconnect();
  }

  console.log('Prisma se conectó correctamente a PostgreSQL.');
} catch (error) {
  if (error instanceof DatabaseConfigurationError) {
    console.error(error.message);
  } else {
    const code = error?.code ?? error?.errorCode;
    const detail = /^P\d{4}$/.test(code) ? ` (${code})` : '';
    console.error(`No se pudo verificar la conexión con PostgreSQL${detail}. Revisá DATABASE_URL en backend/.env.`);
  }
  process.exitCode = 1;
}
