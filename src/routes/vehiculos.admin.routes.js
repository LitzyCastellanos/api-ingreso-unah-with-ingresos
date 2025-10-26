import { Router } from 'express';
import { toggleVehiculo, listarVehiculosPorDni } from '../controllers/vehiculos.admin.controller.js';
import { vehiculoToggleSchema } from '../validators/schemas.js';

const r = Router();

r.get('/:dni', listarVehiculosPorDni);
r.post('/toggle', validate(vehiculoToggleSchema), toggleVehiculo);
r.post('/activar', validate(vehiculoToggleSchema), (req,res,next)=>{ req.body.activo = true;  return toggleVehiculo(req,res,next); });
r.post('/desactivar',validate(vehiculoToggleSchema), (req,res,next)=>{ req.body.activo = false; return toggleVehiculo(req,res,next); });

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
