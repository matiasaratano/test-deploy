import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: mysql2,
  }
);

try {
  await connection.authenticate();
  console.log('Connection has been established succesfully');
} catch (error) {
  console.error('Unable to connect to the database', error);
}

export default connection;
