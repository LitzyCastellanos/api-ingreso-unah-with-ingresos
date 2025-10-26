import { Router } from 'express';
import pkg from 'pg';

const router = Router();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

// -------------------------------------------
// GET estado biometría: ¿ya existe foto?
// GET /api/v1/personas/biometria/:dni
// -------------------------------------------
router.get('/:dni', async (req, res) => {
  const { dni } = req.params;

  try {
    const q = 'SELECT 1 FROM app.rostros WHERE dni = $1 LIMIT 1';
    const result = await pool.query(q, [dni]);

    res.json({ ok: true, enrolled: result.rowCount > 0 });
  } catch (e) {
    console.error('Estado biometría:', e);
    res.status(500).json({ ok: false, error: 'estadoBiometria failed' });
  }
});

// -------------------------------------------
// POST guardar biometría base64
// POST /api/v1/personas/biometria
// body: { dni, face_template_b64 }
// -------------------------------------------
router.post('/', async (req, res) => {
  const { dni, face_template_b64, mime = 'image/jpeg' } = req.body || {};

  if (!dni || !face_template_b64) {
    return res.status(400).json({ ok: false, error: 'dni y face_template_b64 requeridos' });
  }

  try {
    // verificar si existía
    const existed = await pool.query(
      'SELECT 1 FROM app.rostros WHERE dni = $1 LIMIT 1',
      [dni]
    );

    const sql = `
      INSERT INTO app.rostros (dni, foto, mime)
      VALUES (
        $1,
        decode(regexp_replace($2, '^data:image/[^;]+;base64,', ''), 'base64'),
        $3
      )
      ON CONFLICT (dni)
      DO UPDATE SET foto = EXCLUDED.foto,
                    mime = EXCLUDED.mime,
                    created_at = now()
    `;

    await pool.query(sql, [dni, face_template_b64, mime]);

    res.json({
      ok: true,
      created: existed.rowCount === 0,
      updated: existed.rowCount > 0
    });

  } catch (e) {
    console.error('Guardar biometría:', e);
    res.status(500).json({ ok: false, error: 'guardarBiometria failed' });
  }
});

export default router;
