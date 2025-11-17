import { Persona } from '../models/persona.js';
import { Visita } from '../models/visita.js';

export async function agregarVisita(req, res) {
    try {
        const { nombre, apellido, dni, contrasena, foto, observaciones } = req.body;

        // Validación mínima
        if (!nombre || !apellido || !dni || !contrasena) {
           res.status(400).json({ ok: false, message: "Faltan datos obligatorios" });
            return 
        }

        // 1️⃣ Crear nueva persona
        const persona = await Persona.create({
            Nombre: nombre,
            Apellido: apellido,
            DNI: dni,
            Contrasena: contrasena,
            Foto: foto || null,
        });

        // 2️⃣ Crear visita asociada
        const visita = await Visita.create({
            Id_persona: persona.Id_persona,
            Observaciones: observaciones || null,
        });

        // 3️⃣ Responder con datos
        res.status(201).json({
            ok: true,
            message: "Visita registrada correctamente",
            persona,
            visita
        });

    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ ok: false, message: "La persona ya existe" });
        }
        console.error("❌ Error en agregarVisita:", err);
        res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
}



