import { Router } from "express";
import UserXListaController from '../controllers/UserXListaController.js'
import  Auth  from '../middleware/Auth.js';

const userXListaRoutes = Router()
const userXListaController = new UserXListaController

//CRUD ROLES
userXListaRoutes.post("", Auth,userXListaController.createUserXLista)
userXListaRoutes.get("", userXListaController.getAllUserXLista)
userXListaRoutes.get("/:id", userXListaController.getAllUserByIdLista)
userXListaRoutes.put("/:id", userXListaController.updateUserXLista)
userXListaRoutes.delete("", userXListaController.deleteUserXLista)

export default userXListaRoutes