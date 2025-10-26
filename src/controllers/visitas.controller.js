import { query } from '../db.js';

export async function upsertVisita(req, res, next) {
  try {
    const {
      dni, nombre_completo, categoria, empresa, rtn, motivo,
      fecha_inicio, fecha_fin, face_template_b64
    } = req.body;

    const params = [
      dni, nombre_completo, categoria, empresa ?? null, rtn ?? null, motivo ?? null,
      fecha_inicio ?? null, fecha_fin ?? null, face_template_b64 ?? null
    ];

    const { rows } = await query(
      'SELECT app.upsert_perfil_visita($1,$2,$3,$4,$5,$6,$7,$8,$9) AS persona_id',
      params
    );

    return res.status(201).json({ ok: true, persona_id: rows[0].persona_id });
  } catch (e) { next(e); }
}
