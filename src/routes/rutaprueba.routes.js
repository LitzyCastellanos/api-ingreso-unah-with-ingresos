import { Router } from 'express';
import { crearPersona2 } from '../controllers/prueba.controller.js';

const router = Router();

router.post('/crearPersona2', crearPersona2);

export default router;
