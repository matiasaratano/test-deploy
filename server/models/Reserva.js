import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";
import { ErrorMessage } from "../helpers/ErrorMessages.js";

class Reserva extends Model { }

Reserva.init({
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: { args: true, msg: ErrorMessage.EMPTY_FIELD },
        }
    },
    vianda: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: ErrorMessage.NOT_NULL },
            isIn: { args: [[true, false]], msg: ErrorMessage.NOT_BOOLEAN }
        }
    },
    presente: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notNull: { args: true, msg: ErrorMessage.NOT_NULL },
            isIn: { args: [[true, false]], msg: ErrorMessage.NOT_BOOLEAN }
        }
    }
}, {
    sequelize: connection,
    modelName: "Reserva",
})

export default Reserva
