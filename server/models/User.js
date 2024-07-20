import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";
import { ErrorMessage } from "../helpers/ErrorMessages.js";

class User extends Model { }

User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: ErrorMessage.EMPTY_FIELD },
      },
    },
    userPassword: {
      type: DataTypes.STRING(250),
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: ErrorMessage.EMPTY_FIELD },
      },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: ErrorMessage.EMPTY_FIELD },
        isEmail: { args: true, msg: ErrorMessage.NOT_EMAIL },
      },
    },
    // bossId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: 'User', 
    //     key: 'userId', 
    //   }
    // },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: ErrorMessage.EMPTY_FIELD },
      },
    },
  },
  {
    sequelize: connection,
    modelName: "User",
  }
);

export default User;