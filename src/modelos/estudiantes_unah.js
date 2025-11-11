import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';
import { PersonaUniversidad } from './Persona_unah.js';

export const EstudianteUniversidad = sequelize.define('EstudianteUniversidad', {
  Id_estudiante_uni: {
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
  Id_persona_uni: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: PersonaUniversidad,
      key: 'Id_persona_uni',
    },
  },
}, {
  tableName: 'Estudiantes_universidad',
  freezeTableName: true,
  timestamps: false,
});
