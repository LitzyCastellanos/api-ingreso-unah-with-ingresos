import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';

export const Marca = sequelize.define('Marca', {
  Id_marca: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Marca: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'Marcas',
  freezeTableName: true,
  timestamps: false,
});
