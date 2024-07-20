import { Router } from 'express';
import userRoutes from './userRoutes.js';
import reservaRoutes from './reservaRoutes.js';
import ListaEsperaRoutes from './listaEsperaRoutes.js';
import userXListaRoutes from './userXListaRoutes.js';
import reportRoutes from './reportRoutes.js'; 

const router = Router();

router.use('/user', userRoutes);
router.use('/reserva', reservaRoutes);
router.use('/ListaEspera', ListaEsperaRoutes);
router.use('/userXLista', userXListaRoutes);
router.use('/report', reportRoutes); 

export default router;