import { DataTypes } from 'sequelize';
import { sequelize } from '../config/orm.js';
import { Persona } from './persona.js'; // para relación

export const Estudiante = sequelize.define('Estudiante', {
  persona_id: {
    type: DataTypes.UUID,
    primaryKey: true,            // 🔑 según tu captura
    allowNull: false,
  },
  numero_cuenta: {
    type: DataTypes.STRING(20),
    allowNull: false,
    // unique: true, // habilítalo si en BD es único
  },
  forma03_activa: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  periodo_vigente: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'estudiantes',
  schema: 'app',
  timestamps: false, // tu tabla no tiene created_at/updated_at
});

// Relaciones (opcional pero recomendado)
Persona.hasOne(Estudiante, {
  foreignKey: 'persona_id',
  as: 'estudiante',
});
Estudiante.belongsTo(Persona, {
  foreignKey: 'persona_id',
  as: 'persona',
});
