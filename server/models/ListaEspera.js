import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";
import { ErrorMessage } from "../helpers/ErrorMessages.js";

class ListaEspera extends Model { }

ListaEspera.init({
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true ,
        validate: {
            notEmpty: { args: true, msg: ErrorMessage.EMPTY_FIELD },
        }
    },
}, {
    sequelize: connection,
    modelName: "ListaEspera",
})

export default ListaEspera
