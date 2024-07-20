import { DataTypes, Model } from 'sequelize';
import connection from '../connection/connection.js';
import User from './User.js';
import ListaEspera from './ListaEspera.js';
import { ErrorMessage } from '../helpers/ErrorMessages.js';

class UserXLista extends Model {}

UserXLista.init(
  {
    UserId: {
      type: DataTypes.INTEGER(11),
      references: {
        model: User,
        key: 'id',
      },
      validate: {
        notEmpty: { args: true, msg: ErrorMessage.EMPTY_FIELD },
        isInt: { args: true, msg: ErrorMessage.NOT_INT },
      },
    },
    fecha: {
      type: DataTypes.DATEONLY,
      references: {
        model: ListaEspera,
        key: 'id',
      },
      validate: {
        notEmpty: { args: true, msg: ErrorMessage.EMPTY_FIELD },
      },
    },
    ingreso: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: ErrorMessage.EMPTY_FIELD },
      },
    },
  },
  {
    sequelize: connection,
    modelName: 'UserXLista',
  }
);

export default UserXLista;
