import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';
import { Persona } from './persona.js';

export const Visita = sequelize.define('Visita', {
  Id_visitas: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Observaciones: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Id_persona: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: Persona,
      key: 'Id_persona',
    },
  },
}, {
  tableName: 'Visitas',
  freezeTableName: true,
  timestamps: false,
});
