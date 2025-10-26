import { query } from '../db.js';

/**
 * Convierte un data URL (data:image/jpeg;base64,...) o un base64 "puro"
 * a Buffer binario para columna BYTEA.
 */
function dataUrlToBuffer(dataUrlOrBase64) {
  if (!dataUrlOrBase64) return null;
  const parts = String(dataUrlOrBase64).split(',');
  const b64 = parts.length > 1 ? parts[1] : parts[0];
  try {
    return Buffer.from(b64, 'base64');
  } catch {
    return null;
  }
}

export async function guardarBiometria(req, res, next){
  try{
    const { dni, face_template_b64 } = req.body;
    if (!dni || !face_template_b64) {
      const err = new Error('dni y face_template_b64 son requeridos'); err.status=400; throw err;
    }

    // 1) Persona por DNI
    const p = await query('SELECT persona_id FROM app.personas WHERE dni=$1', [dni]);
    if (p.rowCount === 0) { const err = new Error('PERSONA_NO_REGISTRADA'); err.status=404; throw err; }
    const persona_id = p.rows[0].persona_id;

    // 2) Convertir a BYTEA
    const plantillaBuf = dataUrlToBuffer(face_template_b64);
    if (!plantillaBuf) { const err = new Error('PLANTILLA_INVALIDA'); err.status=400; throw err; }

    // 3) UPSERT
    const existe = await query('SELECT 1 FROM app.biometria WHERE persona_id=$1', [persona_id]);

    if (existe.rowCount > 0){
      await query(
        `UPDATE app.biometria
           SET plantilla = $1,
               proveedor_biometrico = $2,
               face_template_b64 = $3,
               updated_at = now()
         WHERE persona_id = $4`,
        [plantillaBuf, 'DEMO_BASE64', face_template_b64, persona_id]
      );
      return res.status(200).json({ ok:true, updated:true });
    }else{
      await query(
        `INSERT INTO app.biometria (escaneo_facial_id, persona_id, proveedor_biometrico, plantilla, created_at, face_template_b64, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, now(), $4, NULL)`,
        [persona_id, 'DEMO_BASE64', plantillaBuf, face_template_b64]
      );
      return res.status(201).json({ ok:true, created:true });
    }
  }catch(e){ next(e); }
}

export async function obtenerEstadoBiometria(req,res,next){
  try{
    const { dni } = req.params;
    const p = await query('SELECT persona_id FROM app.personas WHERE dni=$1', [dni]);
    if (p.rowCount === 0) return res.json({ ok:true, enrolled:false });

    const persona_id = p.rows[0].persona_id;
    // Si hay fila y plantilla no es NULL ⇒ enrolado
    const b = await query('SELECT (plantilla IS NOT NULL) AS enrolled FROM app.biometria WHERE persona_id=$1', [persona_id]);
    if (b.rowCount === 0) return res.json({ ok:true, enrolled:false });
    return res.json({ ok:true, enrolled: !!b.rows[0].enrolled });
  }catch(e){ next(e); }
}
