import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';

export const Persona = sequelize.define('Persona', {
  Id_persona: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  DNI: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  Contrasena: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'Personas',   
  freezeTableName: true,   
  timestamps: false,      
});
