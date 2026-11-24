import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

export class DatabaseConfigurationError extends Error {}

let prisma;

function getDatabaseUrl() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new DatabaseConfigurationError('Falta DATABASE_URL en backend/.env.');
  }

  let url;
  let password;
  try {
    url = new URL(connectionString);
    password = decodeURIComponent(url.password);
  } catch {
    throw new DatabaseConfigurationError('DATABASE_URL debe ser una URL válida de PostgreSQL.');
  }

  if (!['postgresql:', 'postgres:'].includes(url.protocol) || !url.hostname || !url.username) {
    throw new DatabaseConfigurationError('DATABASE_URL debe ser una URL válida de PostgreSQL.');
  }

  if (!password || /^(?:\[(?:YOUR[-_])?PASSWORD\]|YOUR[-_]PASSWORD)$/i.test(password)) {
    throw new DatabaseConfigurationError('Completá la contraseña de DATABASE_URL en backend/.env.');
  }

  return connectionString;
}

export function getPrisma() {
  if (!prisma) {
    const adapter = new PrismaPg({
      connectionString: getDatabaseUrl(),
      connectionTimeoutMillis: 5000,
    });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}
