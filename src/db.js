import mysql from 'mysql2/promise';

// Mostrar variables de entorno (solo para debug)
console.log(process.env.MYSQL_DATABASE);
console.log(process.env.MYSQL_HOST);
console.log(process.env.MYSQL_PASSWORD);
console.log(process.env.MYSQL_USER);

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  connectionLimit: 10, // número máximo de conexiones
});

// Función para ejecutar consultas
export async function query(sql, params) {
  const start = Date.now();
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } finally {
    connection.release();
    const ms = Date.now() - start;
    if (process.env.REQUEST_LOG) {
      console.log(`[MySQL] %s in %dms`, sql.split('\n')[0].slice(0, 80), ms);
    }
  }
}

// Manejo de errores en el pool
pool.on('error', (err) => {
  console.error('[MySQL] Pool error', err);
});
