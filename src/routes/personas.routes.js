import { Router } from 'express';
import { getPersonaByDni, upsertEstudiante, upsertEmpleado } from '../controllers/personas.controller.js';
import { estudianteSchema, empleadoSchema } from '../validators/schemas.js';

const r = Router();

r.get('/:dni', getPersonaByDni);

r.post('/estudiante', validate(estudianteSchema), upsertEstudiante);

r.post('/empleado', validate(empleadoSchema), upsertEmpleado);

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
