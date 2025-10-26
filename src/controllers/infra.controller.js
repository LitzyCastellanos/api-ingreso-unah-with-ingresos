import { query } from '../db.js';

export async function crearPorton(req, res, next){
  try{
    const { nombre_porton, tipo } = req.body;
    const { rows } = await query('SELECT app.porton_crear($1,$2) AS porton_id', [nombre_porton, tipo]);
    res.status(201).json({ ok: true, porton_id: rows[0].porton_id });
  }catch(e){ next(e); }
}

export async function crearLector(req, res, next){
  try{
    const { porton_id, tipo_credencial } = req.body;
    const { rows } = await query('SELECT app.lector_crear($1,$2) AS lector_id', [porton_id, tipo_credencial]);
    res.status(201).json({ ok: true, lector_id: rows[0].lector_id });
  }catch(e){ next(e); }
}

export async function listarPortones(req, res, next){
  try{
    const { rows } = await query('SELECT porton_id, nombre_porton, tipo FROM app.portones ORDER BY nombre_porton');
    res.json({ ok: true, data: rows });
  }catch(e){ next(e); }
}

export async function listarLectores(req, res, next){
  try{
    const { rows } = await query(`
      SELECT l.lector_id, l.tipo_credencial, p.porton_id, p.nombre_porton, p.tipo AS tipo_porton
      FROM app.lectores l
      LEFT JOIN app.portones p USING (porton_id)
      ORDER BY p.nombre_porton, l.tipo_credencial
    `);
    res.json({ ok: true, data: rows });
  }catch(e){ next(e); }
}

export async function autorizacionesPorDni(req, res, next){
  try{
    const { dni } = req.params;
    const { rows } = await query('SELECT * FROM app.persona_autorizaciones($1)', [dni]);
    res.json({ ok: true, data: rows });
  }catch(e){ next(e); }
}
