import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';
import { PersonaUniversidad } from './Persona_unah.js';

export const EmpleadoUniversidad = sequelize.define('EmpleadoUniversidad', {
  Id_empleados_uni: {
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
  Id_persona_uni: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: PersonaUniversidad,
      key: 'Id_persona_uni',
    },
  },
}, {
  tableName: 'Empleados_universidad',
  freezeTableName: true,
  timestamps: false,
});
