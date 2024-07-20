import {Reserva, User, UserXLista , ListaEspera} from '../models/index.js'
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import Formateador from '../services/Formateador/index.js';

class UserXListaController {
    constructor() { }

    createUserXLista = async (req,res) => {
        try {
            const { fecha, userId } = req.body;
        
            // Busca o crea la lista de espera con la fecha especificada
            const [lista, created] = await ListaEspera.findOrCreate({
              where: { fecha: fecha },
              defaults: {
                fecha: fecha
              }
            });
        
            // Ahora crea la relación UserXLista con el userId y la lista creada o encontrada
            const userXLista = await UserXLista.create({
              UserId: userId,
              fecha: lista.fecha,
              ingreso: new Date() 
            });
        
            res.status(200).send({ success: true, message: userXLista});
        
          } catch (error) {
            res.status(400).send({ success: false, message: error.message });
          }
        };
    getAllUserXLista = async (req,res) => {
        try {
            res.status(200).send({ success: true, message: "User" });

        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }
    getAllUserByIdLista = async (req,res) => {
        try {
            res.status(200).send({ success: true, message: "User" });

        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }
    updateUserXLista = async (req,res) => {
        try {
            res.status(200).send({ success: true, message: "User" });

        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }
    deleteUserXLista = async (req,res) => {
        try {
            res.status(200).send({ success: true, message: "User" });

        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }

}

export default UserXListaController