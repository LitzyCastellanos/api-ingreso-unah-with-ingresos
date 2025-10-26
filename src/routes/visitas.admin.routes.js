import { Router } from 'express';
import { revocarVisita, visitasActivasPorDni } from '../controllers/visitas.admin.controller.js';
import { visitaRevocarSchema } from '../validators/schemas.js';

const r = Router();

r.get('/:dni/activas', visitasActivasPorDni);
r.post('/revocar', validate(visitaRevocarSchema), revocarVisita);

export default r;

function validate(schema){
  return (req,res,next)=>{
    const parsed = schema.safeParse(req.body);
    if (!parsed.success){
      const err = new Error(parsed.error.errors.map(e=>`${e.path.join('.')} ${e.message}`).join('; '));
      err.status = 400; return next(err);
    }
    next();
  };
}
