

import { Estudiante } from '../modelos/estudiantes.js';

export async function loginestudiante(req, res) {
  try {
    const { numerocuenta } = req.body;
   
    if (!numerocuenta) {
      return res.status(400).json({ ok: false, message: 'Faltan credenciales' });
    }

        const estudiante = await Estudiante.findOne({ where: { numerocuenta } });


     if (!estudiante) {
      return res.status(404).json({ ok: false, message: 'Estudiante no encontrado' });
    }


     return res.json({
      ok: true,
      message: 'Inicio de sesión exitoso',
      usuario: {
       
        nombre_completo: estudiante.nombre_completo,
      }
    });

  } catch (err) {
    console.error('❌ Error login:', err);
    res.status(500).json({ ok: false, message: 'Error en el servidor' });
  }

}


