import { Router } from 'express';
import { loginPrimeravez,prelogin,loginRegistrado } from '../controllers/login.controller.js';

const router = Router();


router.post('/prelogin', prelogin);
router.post('/auth', loginRegistrado);
router.post('/first', loginPrimeravez);


export default router;
