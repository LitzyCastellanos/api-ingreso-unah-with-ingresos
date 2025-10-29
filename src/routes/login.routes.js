import { Router } from 'express';
import { loginestudiante } from '../controllers/login.controller.js';

const router = Router();

router.get('/numerodecuenta', loginestudiante);

export default router;
