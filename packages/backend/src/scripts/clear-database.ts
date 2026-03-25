import { Pool } from 'pg';

async function main(): Promise<void> {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query('TRUNCATE TABLE users CASCADE;');
    console.warn('Test database cleared successfully (users table truncated with CASCADE).');
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
