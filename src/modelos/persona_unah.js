import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';

export const PersonaUniversidad = sequelize.define('PersonaUniversidad', {
  Id_persona_uni: {
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
  Tipo: {
    type: DataTypes.ENUM('Estudiante', 'Empleado'),
    allowNull: false,
  },
  Carrera: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Puesto: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Num_cuenta: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'Personas_universidad', // nombre exacto de la tabla en MySQL
  freezeTableName: true,             // evita pluralización
  timestamps: false,                 // no tiene createdAt ni updatedAt
});
