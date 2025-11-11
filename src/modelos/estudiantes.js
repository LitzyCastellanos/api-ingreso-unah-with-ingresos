import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';
import { Persona } from './persona.js';

export const Estudiante = sequelize.define('Estudiante', {
  Id_estudiante: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Carrera: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Facultad: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Num_cuenta: {
    type: DataTypes.INTEGER,
    unique: true,
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
  tableName: 'Estudiantes',
  freezeTableName: true,
  timestamps: false,
});
