import { Router } from 'express';
import { registrarPersona, getPersonaByDni } from '../controllers/personas.controller.js';

const router = Router();

// Registrar persona
router.post('/registrar', registrarPersona);

// Consultar persona por DNI
router.get('/:dni', getPersonaByDni);

export default router;
