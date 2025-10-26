import { z } from 'zod';

export const estudianteSchema = z.object({
  dni: z.string().min(5),
  nombre_completo: z.string().min(3),
  numero_cuenta: z.string().min(5),
  face_template_b64: z.string().nullish()
});

export const empleadoSchema = z.object({
  dni: z.string().min(5),
  nombre_completo: z.string().min(3),
  numero_empleado: z.string().min(2),
  face_template_b64: z.string().nullish()
});

export const visitaSchema = z.object({
  dni: z.string().min(5),
  nombre_completo: z.string().min(3),
  categoria: z.enum(['PROVEEDOR','INVITADO','MANTENIMIENTO','EVENTO','OTRO']),
  empresa: z.string().nullish(),
  rtn: z.string().nullish(),
  motivo: z.string().nullish(),
  fecha_inicio: z.string().datetime().nullish(),
  fecha_fin: z.string().datetime().nullish(),
  face_template_b64: z.string().nullish()
});

export const vehiculoSchema = z.object({
  dni: z.string().min(5),
  placa: z.string().min(3),
  tipo: z.string().min(2),
  color: z.string().nullish(),
  prestamo_temporal: z.boolean().default(false)
});


export const ingresoRegistroSchema = z.object({
  dni: z.string().min(5),
  tipo_ingreso: z.enum(['PEATONAL','VEHICULAR']),
  origen: z.enum(['ESCANER','MANUAL','WEB']).default('WEB'),
  placa: z.string().nullish(),
  porton_id: z.string().uuid().nullish(),
  lector_id: z.string().uuid().nullish()
});

export const vehiculoToggleSchema = z.object({
  dni: z.string().min(5),
  placa: z.string().min(3),
  activo: z.boolean()
});

export const visitaRevocarSchema = z.object({
  dni: z.string().min(5)
});

export const portonSchema = z.object({
  nombre_porton: z.string().min(3),
  tipo: z.enum(['PEATONAL','VEHICULAR'])
});

export const lectorSchema = z.object({
  porton_id: z.string().uuid(),
  tipo_credencial: z.enum(['CARNET','FORMA03','QR_DNI','FACIAL','PLACA'])
});
