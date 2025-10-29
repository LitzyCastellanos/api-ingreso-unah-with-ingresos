import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';

export const loginE = sequelize.define('LoginEstudiante', {
  numero_cuenta: {
    type: DataTypes.STRING(20),
    allowNull: false,
    // unique: true, // habilítalo si en BD es único
  },
}, {

});


