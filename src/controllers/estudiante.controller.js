import { Estudiante } from '../modelos/estudiantes.js';
import { Persona } from '../modelos/persona.js';

export async function crearEstudiante(req, res) {
  try {
    const { persona_id, numero_cuenta, forma03_activa, periodo_vigente } = req.body;

    if (!persona_id || !numero_cuenta) {
      return res.status(400).json({ ok: false, message: 'persona_id y numero_cuenta son obligatorios' });
    }

    // persona debe existir
    const persona = await Persona.findByPk(persona_id);
    if (!persona) {
      return res.status(404).json({ ok: false, message: 'La persona no existe' });
    }

    // evitar duplicado por persona_id
    const ya = await Estudiante.findByPk(persona_id);
    if (ya) {
      return res.status(409).json({ ok: false, message: 'Esta persona ya es estudiante' });
    }

    const est = await Estudiante.create({
      persona_id,
      numero_cuenta,
      forma03_activa: typeof forma03_activa === 'boolean' ? forma03_activa : null,
      periodo_vigente: periodo_vigente || null,
    });

    return res.status(201).json({ ok: true, message: 'Estudiante creado', estudiante: est });
  } catch (err) {
    console.error('❌ crearEstudiante:', err);
    res.status(500).json({ ok: false, message: 'Error del servidor' });
  }
}

export async function listarEstudiantes(req, res) {
  try {
    const estudiantes = await Estudiante.findAll({
      include: [{ model: Persona, as: 'persona', attributes: ['dni', 'nombre_completo'] }],
      order: [['persona_id', 'ASC']],
    });
    res.json({ ok: true, estudiantes });
  } catch (err) {
    console.error('❌ listarEstudiantes:', err);
    res.status(500).json({ ok: false, message: 'Error del servidor' });
  }
}

export async function obtenerPorPersonaId(req, res) {
  try {
    const { persona_id } = req.params;
    const est = await Estudiante.findByPk(persona_id, {
      include: [{ model: Persona, as: 'persona', attributes: ['dni', 'nombre_completo'] }],
    });
    if (!est) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, estudiante: est });
  } catch (err) {
    console.error('❌ obtenerPorPersonaId:', err);
    res.status(500).json({ ok: false, message: 'Error del servidor' });
  }
}

export async function actualizarEstudiante(req, res) {
  try {
    const { persona_id } = req.params;
    const { numero_cuenta, forma03_activa, periodo_vigente } = req.body;

    const est = await Estudiante.findByPk(persona_id);
    if (!est) return res.status(404).json({ ok: false, message: 'No encontrado' });

    await est.update({
      numero_cuenta: numero_cuenta ?? est.numero_cuenta,
      forma03_activa: (typeof forma03_activa === 'boolean') ? forma03_activa : est.forma03_activa,
      periodo_vigente: periodo_vigente ?? est.periodo_vigente,
    });

    res.json({ ok: true, message: 'Actualizado', estudiante: est });
  } catch (err) {
    console.error('❌ actualizarEstudiante:', err);
    res.status(500).json({ ok: false, message: 'Error del servidor' });
  }
}

export async function eliminarEstudiante(req, res) {
  try {
    const { persona_id } = req.params;
    const est = await Estudiante.findByPk(persona_id);
    if (!est) return res.status(404).json({ ok: false, message: 'No encontrado' });
    await est.destroy();
    res.json({ ok: true, message: 'Eliminado' });
  } catch (err) {
    console.error('❌ eliminarEstudiante:', err);
    res.status(500).json({ ok: false, message: 'Error del servidor' });
  }
}
