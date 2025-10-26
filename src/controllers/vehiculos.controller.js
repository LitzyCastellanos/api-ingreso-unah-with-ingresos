import { query } from '../db.js';

export async function asignarVehiculo(req, res, next) {
  try {
    const { dni, placa, tipo, color, prestamo_temporal } = req.body;
    const { rows } = await query(
      'SELECT app.asignar_vehiculo($1,$2,$3,$4,$5) AS result',
      [dni, placa, tipo, color ?? null, Boolean(prestamo_temporal)]
    );
    const result = rows[0]?.result || 'OK';
    if (result.startsWith('ERROR')) {
      const err = new Error(result);
      err.status = 422;
      throw err;
    }
    return res.status(201).json({ ok: true });
  } catch (e) { next(e); }
}
