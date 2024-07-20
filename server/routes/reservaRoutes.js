import { Router } from 'express';
import ReservaController from '../controllers/ReservaController.js';
import  Auth  from '../middleware/Auth.js';
import  AdminAuth  from '../middleware/AdminAuth.js';

const reservaRoutes = Router();
const reservaController = new ReservaController();

//CRUD
reservaRoutes.post('', reservaController.createReserva);
reservaRoutes.post('/reservas', Auth,reservaController.createReservas);
reservaRoutes.get('', reservaController.getCantReservas);
reservaRoutes.get('/all', AdminAuth,reservaController.getReservas);
reservaRoutes.get('/:id', reservaController.getReservaById);
reservaRoutes.get('/user/:id', Auth,reservaController.getAllReservasByUser);
reservaRoutes.put('/:id', reservaController.updateReserva);
reservaRoutes.put('/multiple/viandas', Auth, reservaController.updateViandaReservas);
reservaRoutes.put('/vianda/:id', Auth, reservaController.updateViandaReserva);
reservaRoutes.delete('/:id', Auth, reservaController.deleteReserva);
reservaRoutes.put('/update/:id', AdminAuth, reservaController.updatePresence);

reservaRoutes.delete('/admin/:id', AdminAuth,reservaController.adminDeleteReserva);

export default reservaRoutes;
