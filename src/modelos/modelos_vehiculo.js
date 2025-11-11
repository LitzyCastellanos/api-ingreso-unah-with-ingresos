import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';
import { Marca } from './marcas.js';

export const Modelo = sequelize.define('Modelo', {
  Id_modelo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Modelo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  Id_marca: {
    type: DataTypes.INTEGER,
    references: {
      model: Marca,
      key: 'Id_marca',
    },
  },
}, {
  tableName: 'Modelos',
  freezeTableName: true,
  timestamps: false,
});
