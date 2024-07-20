import ListaEspera from './ListaEspera.js';
import Reserva from './Reserva.js';
import User from './User.js';
import UserXLista from './UserXLista.js';

User.hasMany(User, { foreignKey: 'bossId', as: 'subordinates' });
User.belongsTo(User, { foreignKey: 'bossId', as: 'boss' });
User.hasMany(Reserva, { foreignKey: 'UserId' });
Reserva.belongsTo(User, { foreignKey: 'UserId' });
User.belongsToMany(ListaEspera, {
  through: UserXLista,
  foreignKey: 'UserId',
  uniqueKey: false,
});
ListaEspera.belongsToMany(User, {
  through: UserXLista,
  foreignKey: 'fecha',
  uniqueKey: false,
});

export { User, Reserva, ListaEspera, UserXLista };
