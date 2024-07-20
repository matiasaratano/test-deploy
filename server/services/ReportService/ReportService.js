import { Op } from 'sequelize';
import  User  from '../../models/User.js';
import { Sequelize } from 'sequelize';
import ReservaController from '../../controllers/ReservaController.js';

class ReportService {
    constructor() {}

    generateReport = async (month, year) => {
        try {
            const users = await User.findAll({
                where: Sequelize.where(
                    Sequelize.fn('lower', Sequelize.col('role')), {
                        [Op.notIn]: ['admin', 'rrhh']
                    }
                )
            });

            const report = [];

            // Crear una instancia de ReservaController
            const reservaController = new ReservaController();

            for (let user of users) {
                // Llamar al método en la instancia de ReservaController
                const reservasTotales = await reservaController.getAllReservasByUserForMonth(user.userId, month, year);
                //console.log("Reservas totales en ReservasController: " + JSON.stringify(reservasTotales, null, 2));

                const numReservas = reservasTotales.length;
                const numAusentes = reservasTotales.filter(objetoReserva => objetoReserva.reserva.presente === false).length;
                const presentismo = numReservas > 0 ? +(100 * (numReservas - numAusentes) / numReservas).toFixed(1) : 0;

                report.push({
                    userFullName: user.fullName,
                    presentismo: presentismo,
                    numReservas: numReservas,
                    numAusentes: numAusentes
                });
            }

            return {
                success: true,
                message: report
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Ocurrió un error al generar el reporte. Por favor, inténtelo nuevamente.'
            };
        }
    }
}

export default ReportService;