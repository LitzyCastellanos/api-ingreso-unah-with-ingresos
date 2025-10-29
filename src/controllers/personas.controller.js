import { Persona } from '../modelos/persona.js';
import { Estudiante } from '../modelos/estudiantes.js';
import { sequelize } from '../config/orm.js';

/**
 * Registrar una persona (y su rol si aplica)
 * Si el rol es 'estudiante', también crea el registro en la tabla app.estudiantes.
 */
export async function registrarPersona(req, res) {
  const t = await sequelize.transaction();

  try {
    const { dni, nombre_completo, correo, telefono, rol, numero_cuenta, forma03_activa, periodo_vigente } = req.body;

    // ✅ Validaciones básicas
    if (!dni || !nombre_completo) {
      return res.status(400).json({ ok: false, message: 'DNI y nombre completo son obligatorios' });
    }

    // 🧩 Validar duplicados
    const existe = await Persona.findOne({ where: { dni } });
    if (existe) {
      return res.status(409).json({ ok: false, message: 'Ya existe una persona con ese DNI' });
    }

    // 👤 Crear persona
    const persona = await Persona.create({
      dni,
      nombre_completo,
      correo: correo || null,
      telefono: telefono || null
    }, { transaction: t });

    // 🎭 Insertar rol en la tabla intermedia
    if (rol) {
      await sequelize.query(
        `INSERT INTO app.persona_roles (persona_id, rol_id)
         VALUES ($1, (SELECT rol_id FROM app.roles_persona WHERE LOWER(nombre_rol) = LOWER($2) LIMIT 1))`,
        { bind: [persona.persona_id, rol], transaction: t }
      );
    }

    // 🎓 Si el rol es estudiante, también crear el registro en app.estudiantes
    if (rol && rol.toLowerCase() === 'estudiante') {
      await Estudiante.create({
        persona_id: persona.persona_id,
        numero_cuenta,
        forma03_activa: forma03_activa === true || forma03_activa === 'Sí',
        periodo_vigente
      }, { transaction: t });
    }

    await t.commit();

    return res.status(201).json({
      ok: true,
      message: `Persona creada exitosamente${rol ? ` como ${rol}` : ''}`,
      persona
    });

  } catch (error) {
    await t.rollback();
    console.error('❌ Error registrarPersona:', error);
    res.status(500).json({
      ok: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
}

/**
 * Obtener una persona por su DNI
 */
export async function getPersonaByDni(req, res) {
  try {
    const { dni } = req.params;
    const persona = await Persona.findOne({
      where: { dni },
      include: [{ model: Estudiante, as: 'estudiante' }]
    });

    if (!persona) {
      return res.status(404).json({ ok: false, message: 'Persona no encontrada' });
    }

    res.json({ ok: true, persona });
  } catch (error) {
    console.error('❌ getPersonaByDni:', error);
    res.status(500).json({ ok: false, message: 'Error en el servidor' });
  }
}
