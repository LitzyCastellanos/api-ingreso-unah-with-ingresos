import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';

export const Persona = sequelize.define('Persona', {  //exportamos el modleo que queremos usar
  persona_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  dni: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
  },
  nombre_completo: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(120),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'personas',
  schema: 'app',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
},
{
    timestamps: true,
});
