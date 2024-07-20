import { Router } from "express";
import ListaEsperaController from '../controllers/ListaEsperaController.js'

const ListaEsperaRoutes = Router()
const listaEsperaController = new ListaEsperaController


//CRUD ROLES

ListaEsperaRoutes.post("", listaEsperaController.createListaEspera)
ListaEsperaRoutes.get("", listaEsperaController.getAllListaEspera)
ListaEsperaRoutes.get("/:id", listaEsperaController.getListaEsperaById)
ListaEsperaRoutes.put("/:id", listaEsperaController.updateListaEspera)
ListaEsperaRoutes.delete("", listaEsperaController.deleteListaEspera)

export default ListaEsperaRoutes