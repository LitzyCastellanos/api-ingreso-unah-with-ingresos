import { Router } from 'express';
import { vehiculoSchema } from '../validators/schemas.js';
import { asignarVehiculo } from '../controllers/vehiculos.controller.js';

const r = Router();

r.post('/', validate(vehiculoSchema), asignarVehiculo);

export default r;

function validate(schema){
  return (req,res,next)=>{
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) { const err = new Error('Payload inválido'); err.status=400; return next(err);} 
    next();
  };
}
