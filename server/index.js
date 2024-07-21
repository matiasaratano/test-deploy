import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // Importa cors
import router from './routes/router.js';
import connection from './connection/connection.js';

const app = express();

const port = process.env.PORT || 3001;

app.use(cors()); // Configura cors para todas las rutas

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);

app.use((req, res) => {
  res.status(400).send('EndPoint Not Found');
});

await connection.sync({ force: false });

app.listen(port, () => {
  console.log(`El servidor está funcionando en: $${port}`);
});
