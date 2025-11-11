import { Persona } from '../modelos/persona.js';
import { PersonaUniversidad } from '../modelos/Persona_unah.js';
import { Estudiante } from '../modelos/Estudiante.js';
import { Empleado } from '../modelos/Empleado.js';
import { EstudianteUniversidad } from '../modelos/Estudiante_unah.js';
import { EmpleadoUniversidad } from '../modelos/Empleado_unah.js';

export async function loginPersona(req, res) {
  try {
    const { dni: dniRaw } = req.query;

    if (!dniRaw || dniRaw.trim() === '') {
      return res.status(400).json({ ok: false, message: 'Faltan credenciales' });
    }

    const dniTrim = dniRaw.trim();
    let persona = await Persona.findOne({ where: { DNI: dniTrim } });
    let tipo = 'Visita';
    let datosExtra = {};

    // 🔹 Si no existe en Personas, buscar en Personas_universidad
    if (!persona) {
      const personaUni = await PersonaUniversidad.findOne({ where: { DNI: dniTrim } });

      if (!personaUni) {
        return res.status(404).json({ ok: false, message: 'Persona no encontrada en ninguna base' });
      }

      // 🔹 Crear la persona en la tabla Personas
      persona = await Persona.create({
        Nombre: personaUni.Nombre,
        Apellido: personaUni.Apellido,
        DNI: personaUni.DNI,
        Contrasena: null,
        Foto: personaUni.Foto ?? null
      });

      // 🔹 Verificar si pertenece a Estudiante o Empleado en UNAH
      const estudianteUni = await EstudianteUniversidad.findOne({ where: { Id_estudiante_uni: personaUni.Id_persona_uni } });
      const empleadoUni = await EmpleadoUniversidad.findOne({ where: { Id_empleado_uni: personaUni.Id_persona_uni } });

      if (estudianteUni) {
        tipo = 'Estudiante';
        const nuevoEstudiante = await Estudiante.create({
          Id_estudiante: persona.Id_persona,
          Numero_cuenta: estudianteUni.Numero_cuenta
        });
        datosExtra = nuevoEstudiante.toJSON();
      } else if (empleadoUni) {
        tipo = 'Empleado';
        const nuevoEmpleado = await Empleado.create({
          Id_empleado: persona.Id_persona,
          Puesto: empleadoUni.Puesto
        });
        datosExtra = nuevoEmpleado.toJSON();
      } else {
        tipo = 'Visita';
      }
    } 
    else {
      // 🔹 Ya existe en Personas → verificar su tipo actual
      const estudiante = await Estudiante.findOne({ where: { Id_estudiante: persona.Id_persona } });
      const empleado = await Empleado.findOne({ where: { Id_empleado: persona.Id_persona } });

      if (estudiante) {
        tipo = 'Estudiante';
        datosExtra = estudiante.toJSON();
      } else if (empleado) {
        tipo = 'Empleado';
        datosExtra = empleado.toJSON();
      } else {
        tipo = 'Visita';
      }
    }

    // 🔹 Devolver toda la información
    return res.json({
      ok: true,
      message: 'Inicio de sesión exitoso',
      usuario: {
        ...persona.toJSON(),
        Tipo: tipo,
        DatosExtra: datosExtra
      }
    });

  } catch (err) {
    console.error('❌ Error en loginPersona:', err);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
}
