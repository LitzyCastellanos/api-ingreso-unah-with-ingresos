import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    logging: false, // para no ensuciar la consola
  }
);

// probar conexión automáticamente
export async function connectSequelize() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize: Conectado a PostgreSQL');
  } catch (error) {
    console.error('Sequelize Error:', error.message);
  }
}
