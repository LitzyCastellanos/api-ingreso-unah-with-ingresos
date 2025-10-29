import { Persona } from '../modelos/persona.js';
import { Estudiante } from '../modelos/estudiantes.js';
import { sequelize } from '../config/orm.js';

export async function registrarPersona(req, res) {
  const t = await sequelize.transaction();

  try {
    const { dni, nombre_completo, correo, telefono, rol,
            numero_cuenta, forma03_activa, periodo_vigente } = req.body;

    // Validaciones básicas
    if (!dni || !nombre_completo || !rol) {
      return res.status(400).json({ ok: false, message: 'DNI, nombre y rol son obligatorios' });
    }

    // Crear persona
    const persona = await Persona.create({
      dni,
      nombre_completo,
      correo: correo || null,
      telefono: telefono || null,
    }, { transaction: t });

    // Insertar rol
    await sequelize.query(
      `INSERT INTO app.persona_roles (persona_id, rol_id)
       VALUES ($1, (SELECT rol_id FROM app.roles_persona WHERE LOWER(nombre_rol) = LOWER($2) LIMIT 1))`,
      { bind: [persona.persona_id, rol], transaction: t }
    );

    // Si es estudiante, crear también registro en estudiantes
    if (rol.toLowerCase() === 'estudiante') {
      await Estudiante.create({
        persona_id: persona.persona_id,
        numero_cuenta,
        forma03_activa: forma03_activa ?? false,
        periodo_vigente: periodo_vigente || null
      }, { transaction: t });
    }

    await t.commit();

    res.status(201).json({
      ok: true,
      message: `Persona creada exitosamente como ${rol}`,
      persona
    });

  } catch (err) {
    await t.rollback();
    console.error('❌ registrarPersona:', err);
    res.status(500).json({ ok: false, message: 'Error en el servidor', error: err.message });
  }
}
