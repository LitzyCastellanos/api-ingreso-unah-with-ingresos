import { Persona } from '../modelos/persona.js';
import { Estudiante } from '../modelos/estudiantes.js';
import { Empleado } from '../modelos/empleados.js';
import { PersonaUniversidad } from '../modelos/persona_unah.js';
import { EstudianteUniversidad } from '../modelos/estudiantes_unah.js';
import { EmpleadoUniversidad } from '../modelos/empleados_unah.js';

/*
  LOGIN NORMAL: busca solo en tablas principales
*/
export async function loginRegistrado(req, res) {
  try {
    const { dni: dniRaw } = req.query;

    if (!dniRaw || dniRaw.trim() === '') {
      return res.status(400).json({ ok: false, message: 'Faltan credenciales' });
    }

    const dniTrim = dniRaw.trim();
    const persona = await Persona.findOne({ where: { DNI: dniTrim } });

    if (!persona) {
      return res.json({
        ok: true,
        message: 'Persona no registrada, tipo Visita',
        usuario: { Tipo: 'Visita', DatosExtra: {} }
      });
    }

    // 🔹 Determinar tipo
    const estudiante = await Estudiante.findOne({ where: { Id_estudiante: persona.Id_persona } });
    const empleado = estudiante ? null : await Empleado.findOne({ where: { Id_empleados: persona.Id_persona } });

    let tipo = 'Visita';
    let datosExtra = {};

    if (estudiante) {
      tipo = 'Estudiante';
      datosExtra = estudiante.toJSON();
    } else if (empleado) {
      tipo = 'Empleado';
      datosExtra = empleado.toJSON();
    }

    return res.json({
      ok: true,
      message: 'Inicio de sesión exitoso (registro existente)',
      usuario: { ...persona.toJSON(), Tipo: tipo, DatosExtra: datosExtra }
    });

  } catch (err) {
    console.error('❌ Error loginRegistrado:', err);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
}

/*
  LOGIN PRIMERA VEZ: busca en PersonaUniversidad y copia a tablas principales
*/
export async function loginPrimeravez(req, res) {
  try {
    const { dni: dniRaw } = req.query;

    if (!dniRaw || dniRaw.trim() === '') {
      return res.status(400).json({ ok: false, message: 'Faltan credenciales' });
    }

    const dniTrim = dniRaw.trim();
    let persona = await Persona.findOne({ where: { DNI: dniTrim } });
    let tipo = 'Visita';
    let datosExtra = {};

    // 🔹 Si ya existe en tabla principal, delegar a loginRegistrado
    if (persona) {
      return loginRegistrado(req, res);
    }

    // 🔹 Buscar en tabla Universidad
    const personaUni = await PersonaUniversidad.findOne({ where: { DNI: dniTrim } });
    if (!personaUni) {
      return res.status(404).json({ ok: false, message: 'Persona no encontrada en ninguna base' });
    }

    // 🔹 Crear persona en tabla principal
    persona = await Persona.create({
      Nombre: personaUni.Nombre,
      Apellido: personaUni.Apellido,
      DNI: personaUni.DNI,
      Contrasena: personaUni.Contrasena ?? '',
      Foto: personaUni.Foto ?? null
    });

    // 🔹 Verificar si es estudiante o empleado en UNAH
    const estudianteUni = await EstudianteUniversidad.findOne({ where: { Id_persona_uni: personaUni.Id_persona_uni } });
    const empleadoUni = estudianteUni ? null : await EmpleadoUniversidad.findOne({ where: { Id_persona_uni: personaUni.Id_persona_uni } });

    if (estudianteUni) {
      tipo = 'Estudiante';
      const nuevoEstudiante = await Estudiante.create({
        Id_estudiante: persona.Id_persona,
        Carrera: estudianteUni.Carrera,
        Facultad: estudianteUni.Facultad,
        Num_cuenta: estudianteUni.Num_cuenta
      });
      datosExtra = nuevoEstudiante.toJSON();
    } else if (empleadoUni) {
      tipo = 'Empleado';
      const nuevoEmpleado = await Empleado.create({
        Id_empleados: persona.Id_persona,
        Puesto: empleadoUni.Puesto,
        Departamento: empleadoUni.Departamento ?? null,
        Num_empleado: empleadoUni.Num_empleado ?? null
      });
      datosExtra = nuevoEmpleado.toJSON();
    }

    return res.json({
      ok: true,
      message: 'Inicio de sesión exitoso (primer ingreso)',
      usuario: { ...persona.toJSON(), Tipo: tipo, DatosExtra: datosExtra }
    });

  } catch (err) {
    console.error('❌ Error loginPrimeravez:', err);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
}
