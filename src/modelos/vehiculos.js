import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';
import { Persona } from './persona.js';
import { Modelo } from './modelos.js';
import { Color } from './colores.js';

export const Vehiculo = sequelize.define('Vehiculo', {
  Id_vehiculo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Id_modelo: {
    type: DataTypes.INTEGER,
    references: {
      model: Modelo,
      key: 'Id_modelo',
    },
  },
  Color: {
    type: DataTypes.INTEGER,
    references: {
      model: Color,
      key: 'Id_color',
    },
  },
  Ano: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Matricula: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  Foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: Persona,
      key: 'Id_persona',
    },
  },
}, {
  tableName: 'Vehiculos',
  freezeTableName: true,
  timestamps: false,
});
