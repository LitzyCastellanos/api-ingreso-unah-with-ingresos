import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';
import { Persona } from './persona.js';

export const Empleado = sequelize.define('Empleado', {
  Id_empleados: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Puesto: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Departamento: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Num_empleado: {
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
  tableName: 'Empleados',
  freezeTableName: true,
  timestamps: false,
});
