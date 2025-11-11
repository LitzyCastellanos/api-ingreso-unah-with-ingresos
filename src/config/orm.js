import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    dialect: 'mysql',
    logging: false, // para no ensuciar la consola
  }
);

// probar conexión automáticamente
export async function connectSequelize() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize: Conectado a MySQL');
  } catch (error) {
    console.error('Sequelize Error:', error.message);
  }
}




//Sequelize para postgre sql
/*
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
*/