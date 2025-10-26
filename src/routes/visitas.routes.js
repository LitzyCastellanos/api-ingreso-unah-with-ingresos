import { Router } from 'express';
import { visitaSchema } from '../validators/schemas.js';
import { upsertVisita } from '../controllers/visitas.controller.js';

const r = Router();

r.post('/', validate(visitaSchema), upsertVisita);

export default r;

function validate(schema){
  return (req,res,next)=>{
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) { const err = new Error('Payload inválido'); err.status=400; return next(err);} 
    next();
  };
}
