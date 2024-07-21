import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import AdminAuth from '../middleware/AdminAuth.js';

const userRoutes = Router();
const userController = new UserController();

//CRUD
userRoutes.post('', userController.createUser);
userRoutes.get('', userController.getAllUsers);
userRoutes.get('/:id', userController.getUserById);
userRoutes.put('/:id', AdminAuth, userController.updateUser);
userRoutes.delete('/:id', AdminAuth, userController.deleteUser);
userRoutes.post('/login', userController.login);

export default userRoutes;
