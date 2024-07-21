import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';

class UserService {
  constructor() {}

  async createUser(userData) {
    try {
      // Verificar si ya existe un usuario con el mismo email
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error('Ya existe un usuario con ese email');
      }
      // Se hashea la contraseña con brycpt
      const hashedPassword = await bcrypt.hash(userData.userPassword, 6);

      // Se reemplaza la contraseña en texto plano con la contraseña hasheada
      userData.userPassword = hashedPassword;

      // Se crea el usuario en la base de datos
      const newUser = await User.create(userData);
      return { success: true, data: newUser };
    } catch (error) {
      throw new Error('Error al crear el usuario: ' + error.message);
    }
  }

  async getAllUsers() {
    try {
      const allUsers = await User.findAll({
        attributes: [
          'userId',
          'fullName',
          'userPassword',
          'email',
          'role',
          'bossId',
        ],
      });
      return { success: true, data: allUsers };
    } catch (error) {
      throw new Error('Error al traer a todos los usuarios: ' + error.message);
    }
  }

  async getUserById(id) {
    try {
      const UserByid = await User.findByPk(id, {
        attributes: [
          'userId',
          'fullName',
          'userPassword',
          'email',
          'role',
          'bossId',
        ],
      });
      if (!UserByid) throw new Error('Error al traer el usuario con ese ID');
      return { success: true, data: UserByid };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(id, updatedData) {
    try {
      if (updatedData.userPassword) {
        const hashedPassword = await bcrypt.hash(updatedData.userPassword, 6);
        updatedData.userPassword = hashedPassword;
      }

      const updatedRowsCount = await User.update(updatedData, {
        where: { userId: id },
      });
      if (updatedRowsCount === 0)
        throw new Error('No se encontró a un usuario con ese ID');

      const updatedUser = await User.findByPk(id);
      return { success: true, data: updatedUser };
    } catch (error) {
      throw new Error('Error al actualizar el usuario: ' + error.message);
    }
  }

  async deleteUser(id) {
    try {
      const deletedRowCount = await User.destroy({ where: { userId: id } });
      if (deletedRowCount === 0)
        throw new Error('No se encontró a un usuario con ese ID');

      return { success: true, message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      throw new Error('Error al eliminar el usuario: ' + error.message);
    }
  }

  async findByCredentials(email, userPassword) {
    try {
      const user = await User.findOne({ where: { email: email } });

      if (!user) throw new Error('Email o password incorrecta');

      const isMatch = await bcrypt.compare(userPassword, user.userPassword);

      if (!isMatch || !user) throw new Error('Password incorrecta');

      return { success: true, data: user };
    } catch (error) {
      throw new Error('Error al buscar el usuario: ' + error.message);
    }
  }

  generateAuthToken(user) {
    const Token = Jwt.sign(
      { id: user.userId, email: user.email, role: user.role },
      process.env.CLAVE_SECRETA
    );
    return Token;
  }

  async login(userData) {
    try {
      console.log(
        'Email de usuario: ' +
          userData.email +
          ' password de usuario: ' +
          userData.userPassword
      );
      const user = await this.findByCredentials(
        userData.email,
        userData.userPassword
      );
      const Token = this.generateAuthToken(user.data);
      console.log('Token: ' + Token);
      console.log('Usuario: ' + user.data);
      return { success: true, data: Token };
    } catch (error) {
      console.log('Error al iniciar sesión: ' + error.message);
      throw new Error('Error al iniciar sesión: ' + error.message);
    }
  }
}

export default UserService;
