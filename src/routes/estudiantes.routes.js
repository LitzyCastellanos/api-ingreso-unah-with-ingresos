import { Router } from 'express';
import {
  crearEstudiante,
  listarEstudiantes,
  obtenerPorPersonaId,
  actualizarEstudiante,
  eliminarEstudiante,
} from '../controllers/estudiante.controller.js';

const router = Router();

// Base: /api/v1/estudiantes  (móntala así en index.js)
router.get('/', listarEstudiantes);
router.get('/:persona_id', obtenerPorPersonaId);
router.post('/', crearEstudiante);
router.put('/:persona_id', actualizarEstudiante);
router.delete('/:persona_id', eliminarEstudiante);

export default router;
