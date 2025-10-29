import { Router } from 'express';
import { registrarPersona } from '../controllers/personaRol.controller.js';

const router = Router();

// Base: /api/v1/personas
router.post('/registrar', registrarPersona);

export default router;
