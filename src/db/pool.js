import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    host: process.env.PGHOST ?? '127.0.0.1',
    port: Number.parseInt(process.env.PGPORT ?? '5432', 10),
    database: process.env.PGDATABASE ?? 'board',
    user: process.env.PGUSER ?? 'board_app',
    password: process.env.PGPASSWORD,
});

export async function closePool() {
    await pool.end();
}
