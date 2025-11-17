import { Persona } from '../modelos/persona.js';
import { Estudiante } from '../modelos/estudiantes.js';
import { Empleado } from '../modelos/empleados.js';
import { PersonaUniversidad } from '../modelos/persona_unah.js';
import { EstudianteUniversidad } from '../modelos/estudiantes_unah.js';
import { EmpleadoUniversidad } from '../modelos/empleados_unah.js';
import {Visita} from '../modelos/visitas.js'


/**
 * Nota: Se usa prelogin para verficar si existe la persona, en al tablas principales o aisladas(Externas)
 * 
 * Segun lo ponga se poner el login, si lo encuentra en la principal es que ya esta registrado en nuestra base de
 */


// ========================================
//   PRELOGIN: Solo verifica si existe
// ========================================
export async function prelogin(req, res) {
  try {
    const dni = req.body.dni?.trim();
    if (!dni) return res.status(400).json({ ok: false, message: "Falta DNI" });

    const persona = await Persona.findOne({ where: { DNI: dni } });

    if (persona) {
      return res.json({
        ok: true,
        existe: true,
        origen: "principal",
        requiereRegistro: false,
      });
    }

    const personaUni = await PersonaUniversidad.findOne({ where: { DNI: dni } });

    if (personaUni) {
      return res.json({
        ok: true,
        existe: true,
        origen: "universidad",
        requiereRegistro: true,
      });
    }

    return res.json({ existe: false, origen:"NuevaVisita" });

  } catch (err) {
    console.error("❌ Error en prelogin:", err);
    res.status(500).json({ ok: false, message: "Error interno del servidor" });
  }
}





/**
   * loginRegistrado
   * ----------------
   * Realiza el inicio de sesión para usuarios que ya existen
   * en las tablas principales del sistema.
   *
   * Flujo:
   *  - Valida DNI recibido.
   *  - Busca a la persona en la tabla principal.
   *  - Determina si es estudiante, empleado o visita.
   *  - Retorna sus datos, roles correspondientes y datos extra.
   *
   * Respuestas:
   *  - 200 → Inicio de sesión exitoso
   *  - 400 → DNI faltante o inválido
   *  - 500 → Error interno
 */

export async function loginRegistrado(req, res) {
  try {
    const { dni, contrasena } = req.body;

    if (!dni || !dni.trim() || !contrasena) {
      return res.status(400).json({ ok: false, message: 'Faltan credenciales' });
    }

    const dniTrim = dni.trim();
    const persona = await Persona.findOne({ where: { DNI: dniTrim } });

    // 🔹 Validar contraseña
    if (persona.Contrasena !== contrasena) {
      return res.status(401).json({ ok: false, message: 'Contraseña incorrecta' });
    }

    // 🔹 Determinar tipo (igual que antes)
    const estudiante = await Estudiante.findOne({ where: { Id_persona: persona.Id_persona } });
    const empleado = await Empleado.findOne({ where: { Id_persona: persona.Id_persona } });
    let  visita = null
    if (!estudiante && !empleado) {
       visita  = await Visita.findOne({ where: { Id_persona: persona.Id_persona } });
    }

    let roles = [];
   
    let datosExtra = {};

    if (estudiante) {
      roles.push("Estudiante");
      datosExtra.estudiante = estudiante.toJSON();
    }

    if (empleado) {
      roles.push("Empleado");
      datosExtra.empleado = empleado.toJSON();
    }

    

    if(visita){
        roles.push("Visita");
      datosExtra.visita = visita.pleado.toJSON();

    }
    return res.json({
      ok: true,
      message: 'Inicio de sesión exitoso',
      usuario: { ...persona.toJSON(), Roles: roles, DatosExtra: datosExtra }
    });

  } catch (err) {
    console.error('❌ Error loginRegistrado:', err);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
}

/**
   * loginPrimeravez
   * ----------------
   * Maneja el inicio de sesión cuando el usuario ingresa por
   * primera vez al sistema.
   *
   * Flujo:
   *  - Valida DNI recibido.
   *  - Busca en tablas de la universidad (PersonaUniversidad).
   *  - Copia los datos desde la base universitaria hacia las tablas
   *    principales (Persona, Estudiante o Empleado).
   *  - Asigna roles y retorna datos completos del usuario.
   *
   * Respuestas:
   *  - 200 → Registro creado y login exitoso
   *  - 404 → No se encuentra en ninguna base
   *  - 400 → DNI faltante
   *  - 500 → Error interno
 */

export async function loginPrimeravez(req, res) {
  try {
    const { dni, contrasena } = req.body;

    if (!dni || !dni.trim() || !contrasena) {
      return res.status(400).json({ ok: false, message: 'Faltan credenciales' });
    }

    const dniTrim = dni.trim();
    // 🔹 Buscar en tabla universidad
    const personaUni = await PersonaUniversidad.findOne({ where: { DNI: dniTrim } });

  
    // 🔹 Validar contraseña
    if (personaUni.Contrasena !== contrasena) {
      return res.status(401).json({ ok: false, message: "Contraseña incorrecta" });
    }

    // 🔹 Crear persona en tabla principal
   const persona = await Persona.create({
      Nombre: personaUni.Nombre,
      Apellido: personaUni.Apellido,
      DNI: personaUni.DNI,
      Contrasena: personaUni.Contrasena,
      Foto: personaUni.Foto ?? null
    });

    let roles = [];
    let datosExtra = {};

    // 🔹 Buscar tipo (estudiante o empleado) en UNAH
    const estudianteUni = await EstudianteUniversidad.findOne({ where: { Id_persona_uni: personaUni.Id_persona_uni } });
    const empleadoUni = estudianteUni ? null : await EmpleadoUniversidad.findOne({ where: { Id_persona_uni: personaUni.Id_persona_uni } });

    if (estudianteUni) {
      roles.push("Estudiante");
      const nuevoEstudiante = await Estudiante.create({
        Carrera: estudianteUni.Carrera,
        Facultad: estudianteUni.Facultad,
        Num_cuenta: estudianteUni.Num_cuenta,
        Id_persona: persona.Id_persona
      });
      datosExtra.estudiante = nuevoEstudiante.toJSON();
    }

    if (empleadoUni) {
      roles.push("Empleado");
      const nuevoEmpleado = await Empleado.create({
        Puesto: empleadoUni.Puesto,
        Departamento: empleadoUni.Departamento ?? null,
        Num_empleado: empleadoUni.Num_empleado ?? null,
        Id_persona: persona.Id_persona
      });
      datosExtra.empleado = nuevoEmpleado.toJSON();
    }



    return res.json({
      ok: true,
      message: 'Inicio de sesión exitoso (primer ingreso)',
      usuario: { ...persona.toJSON(), Roles: roles, DatosExtra: datosExtra }
    });

  } catch (err) {
    console.error('❌ Error loginPrimeravez:', err);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
}

