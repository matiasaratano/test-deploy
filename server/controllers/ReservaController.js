import { Reserva, User, UserXLista } from '../models/index.js';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import fetch from 'node-fetch';
import { transporter } from '../services/NodeMailer/NodeMailer.js';
import Formateador from '../services/Formateador/index.js';

const formateador = new Formateador();

class ReservaController {
  constructor() {}

  createReserva = async (req, res) => {
    try {
      const { fecha, userId } = req.body;

      // Verificamso la disponibilidad de asientos en la oficina
      const reservasExistente = await Reserva.count({
        where: { fecha: fecha },
      });
      if (reservasExistente >= 24) {
        return res.status(400).send({
          success: false,
          message: 'No hay asientos disponibles para realizar la reserva.',
        });
      }

      // Creamos reserva si hay espacio
      const reserva = await Reserva.create({
        fecha: fecha,
        vianda: false,
        UserId: userId,
      });

      // Actualizamos disponibilidad de asientos
      const asientosDisponibles = 24 - reservasExistente - 1; // Restamos 1 por la reserva actual
      console.log(`Quedan ${asientosDisponibles} asientos disponibles.`);

      // Se notifica el estado del cierre de la ejecucion
      res.status(200).send({
        success: true,
        message: 'Reserva realizada satisfactoriamente.',
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ success: false, message: 'Error al crear la reserva.' });
    }
  };
  createReservas = async (req, res) => {
    try {
      const { fechas, userId } = req.body;
      const fechasNoRealizadas = [];
      const reservasRealizadas = [];

      for (let i = 0; i < fechas.length; i++) {
        // Verificamso la disponibilidad de asientos en la oficina , sino se agrega a una lista de fechas que no se pudieron realizar por falta de espacio
        const reservasExistente = await Reserva.count({
          where: { fecha: fechas[i] },
        });
        if (reservasExistente >= 24) {
          fechasNoRealizadas.push(fechas[i]);
        } else {
          // Creamos reserva si hay espacio
          const reserva = await Reserva.create({
            fecha: fechas[i],
            vianda: false,
            UserId: userId,
          });
          //Agregamos fecha a lista de reservas realizadas Correctamente
          reservasRealizadas.push(reserva);
        }
      }
      // Se notifica el estado del cierre de la ejecucion
      res.status(200).send({
        success: true,
        message: 'Reservas realizadas satisfactoriamente.',
        reservasIncompletas: fechasNoRealizadas,
        reservasCompletas: reservasRealizadas,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ success: false, message: 'Error al crear la reserva.' });
    }
  };

  getReservas = async (req, res) => {
    try {
      const reservas = await Reserva.findAll({
        include: {
          model: User,
        },
        order: [
          ['fecha', 'ASC'], // Ordenar por fecha de forma ascendente
        ],
      });

      res.status(200).send({ success: true, message: reservas });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  };

  // Devuelve La cantidad de Reservas por dia si existe alguna reserva
  getCantReservas = async (req, res) => {
    try {
      const reservas = await Reserva.findAll({
        attributes: [
          [Sequelize.literal('DATE_FORMAT(fecha, "%Y-%m-%d")'), 'fecha'],
          // Formato de fecha "yyyy-mm-dd"
          [Sequelize.literal('COUNT(*)'), 'cant'],
          // Contar el número de reservas
        ],
        group: ['fecha'],
        // Agrupar por fecha
      });
      res.status(200).send({ success: true, message: reservas });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  };

  getReservaById = async (req, res) => {
    try {
      res.status(200).send({ success: true, message: 'User' });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  };

  getAllReservasByUser = async (req, res) => {
    try {
      const { id } = req.params;
      const reservasTotales = await Reserva.findAll({
        attributes: [
          [Sequelize.literal('DATE_FORMAT(fecha, "%Y-%m-%d")'), 'fecha'],
          // Formato de fecha "yyyy-mm-dd"
          [Sequelize.literal('COUNT(*)'), 'cant'],
          // Contar el número de reservas
        ],
        group: ['fecha'],
        // Agrupar por fecha
      });
      const fechas = formateador.crearFechas();
      const reservas = await Reserva.findAll({
        where: { UserId: id },
      });

      const resultado = formateador.formatearFechas(
        fechas,
        reservas,
        reservasTotales
      );

      res.status(200).send({ success: true, message: resultado });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  };

  getAllReservasByUserForMonth = async (id, month, year) => {
    try {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);

      console.log('startOfMonth: ' + startOfMonth);
      console.log('endOfMonth: ' + endOfMonth);

      const reservasTotales = await Reserva.findAll({
        attributes: [
          [Sequelize.literal('DATE_FORMAT(fecha, "%Y-%m-%d")'), 'fecha'], // Formato de fecha "yyyy-mm-dd"
          [Sequelize.literal('COUNT(*)'), 'cant'], // Contar el número de reservas
        ],
        group: ['fecha'], // Agrupar por fecha
        where: {
          fecha: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });

      const fechas = formateador.crearFechasDelMes(month, year);
      console.log(
        'Fechas en ReservasController: ' + JSON.stringify(fechas, null, 2)
      );

      const reservas = await Reserva.findAll({
        where: {
          UserId: id,
          fecha: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });

      let resultado = formateador.formatearFechas(
        fechas,
        reservas,
        reservasTotales
      );

      // Filtrar los objetos que no tienen reservas nulas
      resultado = resultado.filter((item) => item.reserva !== null);

      console.log(
        'Resultado en ReservasController: ' + JSON.stringify(resultado, null, 2)
      );

      return resultado;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  updateReserva = async (req, res) => {
    try {
      res.status(200).send({ success: true, message: 'User' });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  };
  updateViandaReserva = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedReserva = await Reserva.update(
        { vianda: true },
        { where: { id: id } }
      );
      if (!updatedReserva) throw new Error('No se pudo modificar vianda');
      res.status(200).send({ success: true, message: updatedReserva });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  };

  updateViandaReservas = async (req, res) => {
    try {
      const { reservasId } = req.body; // Extraer reservasId del cuerpo de la solicitud
      console.log('ReservasId: ' + reservasId)
      let totalUpdated = 0;
  
      for (const reservaId of reservasId) {
        const updatedReservas = await Reserva.update(
          { vianda: true },
          { 
            where: { 
              id: reservaId // Actualiza basado en el ID de la reserva
            } 
          }
        );
        totalUpdated += updatedReservas[0]; // Suma el total de reservas actualizadas
      }
  
      if (totalUpdated === 0) throw new Error('No se encontraron reservas para actualizar');
      res.status(200).send({ success: true, message: `Total de reservas actualizadas: ${totalUpdated}` });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  };

  updatePresence = async (req, res) => {
    try {
      const { id } = req.params;
      const { presente } = req.body;

      const updatedReserva = await Reserva.update(
        { presente: presente },
        { where: { id: id } }
      );

      if (updatedReserva[0] === 0) {
        throw new Error('No se pudo actualizar la presencia');
      }

      res.status(200).send({
        success: true,
        message: 'Presencia actualizada correctamente',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: error.message });
    }
  };

  deleteReserva = async (req, res) => {
    try {
      const { id } = req.params; // Obtenemos el ID de la reserva de los parámetros de la solicitud

      // Verificamos si la reserva existe
      const reserva = await Reserva.findByPk(id);
      console.log('Primera reserva: ' + reserva);
      if (!reserva) {
        return res
          .status(400)
          .send({ success: false, message: 'Reserva no encontrada.' });
      }

      const vianda = reserva.vianda;
      const fecha = reserva.fecha;
      const user = await User.findByPk(reserva.UserId);

      // Eliminamos la reserva
      await Reserva.destroy({ where: { id: id } });

      // Envio de mail a recursos Humanos
      if (vianda) {
        //nxtg tbou bari spda
        await transporter.sendMail({
          from: '"Cancelación de reserva con pedido de vianda" <juan.sosav17@gmail.com>', 
          to: "juan.sosav17@gmail.com", // Acá va el mail de recursos humanos
          subject: "Cancelación de reserva con pedido de vianda", 
          text: `El usuario ${user.fullName} ha cancelado su reserva con pedido de vianda para el día ${fecha}.`, 
        });

      }


      //Buscamos la persona que ingreso primera a la lista de espera si existe
      const userlista = await UserXLista.findOne({
        where: {
          fecha: reserva.fecha,
        },
        order: [['ingreso', 'ASC']],
      });
      console.log('Usuario de la lista: ' + userlista);
      if (userlista) {
        //Creamos Reserva para Usuario en Lista de Espera
        const nuevaReserva = await Reserva.create({
          fecha: userlista.fecha,
          vianda: false,
          UserId: userlista.UserId,
        });
        console.log('Reserva nueva para el usuario: ' + nuevaReserva);
        console.log('Id del Usuario de la lista: ' + userlista.UserId);
        //Borramos al Usuario de La Lista de Espera
        await UserXLista.destroy({
          where: { UserId: userlista.UserId, fecha: userlista.fecha },
        });

        // Traemos la información de Firebase
        const response = await fetch(
          `https://bdt-academy-default-rtdb.firebaseio.com/info.json`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        console.log(
          'Respuesta de Firebase desde el backEnd: ' + JSON.stringify(data)
        );

        const dataArray = Object.values(data);

        // Filtramos la información para quedarnos solo con el objeto que tenga el mismo userId
        const filteredData = dataArray.filter(
          (item) => item.userId === userlista.UserId
        );
        console.log(
          'Data filtrada de firebase: ' + JSON.stringify(filteredData)
        );

        // Enviamos una notificación push
        if (filteredData.length > 0) {
          await this.sendPushNotification(
            filteredData[0].notificationToken,
            'Actualización de reserva',
            'Fuiste eliminado de la lista de espera y se te asignó una reserva.'
          );
        }
      }

      // Enviamos una respuesta de éxito
      res
        .status(200)
        .send({ success: true, message: 'Reserva eliminada correctamente.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ success: false, message: 'Error al eliminar la reserva.' });
    }
  };

  adminDeleteReserva = async (req, res) => {
    try {
      const { id } = req.params; // Obtenemos el ID de la reserva de los parámetros de la solicitud

      const reason = req.body.reason; // Obtenemos el motivo de la cancelación del cuerpo de la solicitud

      const reasonMessage = reason ? ` Motivo: ${reason}` : '';

      // Verificamos si la reserva existe
      const reserva = await Reserva.findByPk(id);
      if (!reserva) {
        return res
          .status(400)
          .send({ success: false, message: 'Reserva no encontrada.' });
      }

      // Guardamos el ID del usuario
      const userId = reserva.UserId;

      const fecha = reserva.fecha;

      // Llamamos al método deleteReserva
      const deleteReservaResponse = await this.deleteReserva(req, res);

      console.log(
        'Respuesta de deleteReserva: ' + JSON.stringify(deleteReservaResponse)
      );

      // Traemos la información de Firebase
      const response = await fetch(
        `https://bdt-academy-default-rtdb.firebaseio.com/info.json`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();

      const dataArray = Object.values(data);

      // Filtramos la información para quedarnos solo con el objeto que tenga el mismo userId
      const filteredData = dataArray.filter((item) => item.userId === userId);

      // Enviamos una notificación push
      if (filteredData.length > 0) {
        await this.sendPushNotification(
          filteredData[0].notificationToken,
          'Reserva eliminada.',
          `Tu reserva para el día ${fecha} ha sido eliminada por un administrador.${reasonMessage}`
        );
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ success: false, message: 'Error al eliminar la reserva.' });
    }
  };

  async sendPushNotification(expoPushToken, title, body) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
}

export default ReservaController;
