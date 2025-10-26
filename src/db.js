import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT || 5432),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  application_name: 'api-ingreso-unah'
});

pool.on('error', (err) => {
  console.error('[PG] Pool error', err);
});

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return res;
  } finally {
    const ms = Date.now() - start;
    if (process.env.REQUEST_LOG) {
      console.log(`[PG] %s in %dms`, text.split('\n')[0].slice(0, 80), ms);
    }
  }
}
