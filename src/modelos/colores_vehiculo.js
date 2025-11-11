import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';

export const Color = sequelize.define('Color', {
  Id_color: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Color: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'Colores',
  freezeTableName: true,
  timestamps: false,
});
