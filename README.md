# API Ingreso UNAH – Uso rápido

## Requisitos
- Node.js 18+
- PostgreSQL en localhost con la BD `sistema_ingreso` y usuario `app_rw`

## Pasos
1. Crea la carpeta del proyecto y copia estos archivos (mismo árbol mostrado).
2. `cp .env.example .env` y ajusta credenciales.
3. `npm install`
4. `npm run dev`
5. Prueba con curl o Postman:

### Health
GET http://localhost:3000/health

### Buscar persona por DNI
GET http://localhost:3000/api/v1/personas/0822199600048

### Crear/editar Estudiante
POST http://localhost:3000/api/v1/personas/estudiante
{
  "dni":"0822199600048",
  "nombre_completo":"Enrique Acosta",
  "numero_cuenta":"20161630025",
  "face_template_b64": null
}

### Crear/editar Empleado
POST http://localhost:3000/api/v1/personas/empleado
{
  "dni":"0801198800002",
  "nombre_completo":"Carlos Pérez",
  "numero_empleado":"EMP-00123",
  "face_template_b64": null
}

### Crear/editar Visita (Proveedor)
POST http://localhost:3000/api/v1/visitas
{
  "dni":"0801197700003",
  "nombre_completo":"María López",
  "categoria":"PROVEEDOR",
  "empresa":"Tecno S.A.",
  "rtn":"0801999-0",
  "motivo":"Mantenimiento",
  "fecha_inicio": null,
  "fecha_fin": "2025-10-20T23:59:59Z",
  "face_template_b64": null
}

### Registrar vehículo (máx 2 activos por persona)
POST http://localhost:3000/api/v1/vehiculos
{
  "dni":"0822199600048",
  "placa":"HAA1234",
  "tipo":"CARRO",
  "color":"GRIS",
  "prestamo_temporal": false
}

## Notas
- Los errores de validación devuelven 400.
- Reglas de negocio (forma 03/contrato, límite de vehículos) se ejecutan en SQL.
# Proyecto-Ingenieria-Software
