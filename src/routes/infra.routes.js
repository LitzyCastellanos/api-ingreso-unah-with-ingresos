import { Router } from 'express';
import { crearPorton, crearLector, listarPortones, listarLectores, autorizacionesPorDni } from '../controllers/infra.controller.js';
import { portonSchema, lectorSchema } from '../validators/schemas.js';

const r = Router();

r.get('/portones', listarPortones);
r.get('/lectores', listarLectores);
r.get('/autorizaciones/:dni', autorizacionesPorDni);

r.post('/portones', validate(portonSchema), crearPorton);
r.post('/lectores', validate(lectorSchema), crearLector);

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
