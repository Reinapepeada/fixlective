import postgres from 'postgres';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL es obligatorio');
export const sql = postgres(process.env.DATABASE_URL, { ssl: process.env.DB_SSL === 'false' ? false : 'require', max: 10 });
