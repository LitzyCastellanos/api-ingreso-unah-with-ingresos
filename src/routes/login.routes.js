import { Router } from 'express';
import { loginPrimeravez } from '../controllers/login.controller.js';

const router = Router();

router.get('/dniPersona', loginPrimeravez);

export default router;
