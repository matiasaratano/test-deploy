import { Sequelize } from 'sequelize';

const connection = new Sequelize('test', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

try {
  await connection.authenticate();
  console.log('Connection has been established succesfully');
} catch (error) {
  console.error('Unable to connect to the database', error);
}

export default connection;
