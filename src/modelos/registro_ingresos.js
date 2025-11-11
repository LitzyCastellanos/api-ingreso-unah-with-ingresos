import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';
import { Persona } from './persona.js';

export const RegistroIngreso = sequelize.define('RegistroIngreso', {
  Id_registro: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Hora_entrada: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  Hora_salida: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  Motivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Id_persona: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Persona,
      key: 'Id_persona',
    },
  },
  Tipo: {
    type: DataTypes.ENUM('Vehicular', 'Peatonal'),
    allowNull: false,
  },
}, {
  tableName: 'Registro_ingresos',
  freezeTableName: true,
  timestamps: false,
});
