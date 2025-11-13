import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';

export const PersonaUniversidad = sequelize.define('PersonaUniversidad', {
  Id_persona_uni: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
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
    allowNull: false, 
  },
  Foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'Personas_universidad',
  freezeTableName: true,
  timestamps: false,
});
