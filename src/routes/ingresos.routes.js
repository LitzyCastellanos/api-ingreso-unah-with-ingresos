import { Router } from 'express';
import { registrarIngreso, historialIngresos } from '../controllers/ingresos.controller.js';
import { ingresoRegistroSchema } from '../validators/schemas.js';

const r = Router();

r.post('/registrar', validate(ingresoRegistroSchema), registrarIngreso);
r.get('/historial', historialIngresos);

export default r;

function validate(schema){
  return (req,res,next)=>{
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const err = new Error(parsed.error.errors.map(e=>`${e.path.join('.')} ${e.message}`).join('; '));
      err.status = 400; return next(err);
    }
    next();
  };
}
