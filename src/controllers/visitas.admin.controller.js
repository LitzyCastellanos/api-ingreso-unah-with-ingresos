import { query } from '../db.js';

export async function revocarVisita(req, res, next){
  try{
    const { dni } = req.body;
    const { rows } = await query('SELECT app.revocar_visita($1) AS msg', [dni]);
    const msg = rows[0]?.msg || '';
    if (msg.startsWith('ERROR')) {
      const err = new Error(msg); err.status = 422; throw err;
    }
    res.json({ ok: true, msg });
  }catch(e){ next(e); }
}

export async function visitasActivasPorDni(req, res, next){
  try{
    const { dni } = req.params;
    const { rows } = await query(`
      SELECT v.categoria, v.empresa, v.rtn, v.motivo, v.fecha_inicio, v.fecha_fin, v.estado
      FROM app.visitas v
      JOIN app.personas p ON p.persona_id = v.persona_id
      WHERE p.dni = $1
        AND v.estado = 'ACTIVA'
        AND (v.fecha_fin IS NULL OR v.fecha_fin > now())
      ORDER BY v.fecha_inicio DESC NULLS LAST
    `, [dni]);
    res.json({ ok: true, data: rows });
  }catch(e){ next(e); }
}
