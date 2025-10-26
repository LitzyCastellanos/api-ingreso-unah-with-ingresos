import { query } from '../db.js';

export async function toggleVehiculo(req, res, next){
  try{
    const { dni, placa, activo } = req.body;
    const { rows } = await query(
      'SELECT app.vehiculo_set_activo($1,$2,$3) AS msg',
      [dni, placa, Boolean(activo)]
    );
    const msg = rows[0]?.msg || '';
    if (msg.startsWith('ERROR')) {
      const err = new Error(msg); err.status = 422; throw err;
    }
    res.status(200).json({ ok: true, msg });
  }catch(e){ next(e); }
}

export async function listarVehiculosPorDni(req, res, next){
  try{
    const { dni } = req.params;
    const { rows } = await query(`
      SELECT v.placa, v.tipo, pv.activo, pv.prestamo_temporal
      FROM app.personas p
      JOIN app.persona_vehiculos pv USING (persona_id)
      JOIN app.vehiculos v USING (vehiculo_id)
      WHERE p.dni = $1
      ORDER BY v.placa
    `, [dni]);
    res.json({ ok: true, data: rows });
  }catch(e){ next(e); }
}
