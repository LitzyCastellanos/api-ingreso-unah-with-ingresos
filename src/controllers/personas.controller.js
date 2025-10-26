import { query } from '../db.js';

export async function getPersonaByDni(req, res, next) {
  try {
    const { dni } = req.params;
    const { rows } = await query(`
      SELECT p.persona_id, p.dni, p.nombre_completo,
             COALESCE(ARRAY_AGG(r.nombre_rol ORDER BY r.nombre_rol) FILTER (WHERE r.nombre_rol IS NOT NULL), '{}') AS roles
      FROM app.personas p
      LEFT JOIN app.persona_roles pr USING(persona_id)
      LEFT JOIN app.roles_persona r USING(rol_id)
      WHERE p.dni = $1
      GROUP BY 1,2,3
    `, [dni]);

    if (!rows.length) return res.json({ existe: false });
    return res.json({ existe: true, persona: rows[0] });
  } catch (e) { next(e); }
}

export async function upsertEstudiante(req, res, next) {
  try {
    const { dni, nombre_completo, numero_cuenta, face_template_b64 } = req.body;
    const { rows } = await query(
      'SELECT app.upsert_perfil_estudiante($1,$2,$3,$4) AS persona_id',
      [dni, nombre_completo, numero_cuenta, face_template_b64]
    );
    return res.status(201).json({ ok: true, persona_id: rows[0].persona_id });
  } catch (e) { next(pgError(e)); }
}

export async function upsertEmpleado(req, res, next) {
  try {
    const { dni, nombre_completo, numero_empleado, face_template_b64 } = req.body;
    const { rows } = await query(
      'SELECT app.upsert_perfil_empleado($1,$2,$3,$4) AS persona_id',
      [dni, nombre_completo, numero_empleado, face_template_b64]
    );
    return res.status(201).json({ ok: true, persona_id: rows[0].persona_id });
  } catch (e) { next(pgError(e)); }
}

function pgError(e){
  const err = new Error(e.detail || e.message);
  if (String(e.message).includes('Una persona no puede tener más de 2')) err.status = 422;
  if (String(e.message).includes('no válido en UNAH')) err.status = 409;
  return err;
}
