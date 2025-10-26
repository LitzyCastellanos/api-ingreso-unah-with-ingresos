import { query } from '../db.js';

export async function registrarIngreso(req, res, next) {
  try {
    const { dni, tipo_ingreso, origen, placa, porton_id, lector_id } = req.body;
    const { rows } = await query(
      'SELECT * FROM app.registrar_ingreso($1,$2,$3,$4,$5,$6)',
      [dni, tipo_ingreso, origen ?? 'WEB', placa ?? null, porton_id ?? null, lector_id ?? null]
    );
    const row = rows[0];
    return res.status(201).json({ ok: true, ...row });
  } catch (e) { next(e); }
}

export async function historialIngresos(req, res, next) {
  try {
    const { dni, desde, hasta, resultado, limit } = req.query;
    const { rows } = await query(
      'SELECT * FROM app.historial_ingresos($1,$2,$3,$4,$5)',
      [dni ?? null, desde ?? null, hasta ?? null, resultado ?? null, limit ? Number(limit) : 100]
    );
    return res.json({ ok: true, data: rows });
  } catch (e) { next(e); }
}
