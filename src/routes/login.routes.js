import { Router } from 'express';
import { loginPersona } from '../controllers/login.controller.js';

const router = Router();

router.get('/dniPersona', loginPersona);

export default router;
