-- 05_ingresos.sql  (ejecutar en DB: sistema_ingreso, usuario: app_owner)
-- Crea tablas mínimas y funciones para registrar intentos de ingreso e historial.

-- Tablas auxiliares (opcionales, para referencia)
CREATE TABLE IF NOT EXISTS app.portones (
  porton_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_porton VARCHAR(60) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('PEATONAL','VEHICULAR'))
);

CREATE TABLE IF NOT EXISTS app.lectores (
  lector_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  porton_id UUID REFERENCES app.portones(porton_id) ON DELETE SET NULL,
  tipo_credencial VARCHAR(30) NOT NULL  -- 'CARNET','FORMA03','QR_DNI','FACIAL','PLACA'
);

-- Log de ingresos
CREATE TABLE IF NOT EXISTS app.ingresos (
  ingreso_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id UUID REFERENCES app.personas(persona_id),
  rol_id SMALLINT REFERENCES app.roles_persona(rol_id),
  tipo_ingreso VARCHAR(15) NOT NULL CHECK (tipo_ingreso IN ('PEATONAL','VEHICULAR')),
  vehiculo_id UUID REFERENCES app.vehiculos(vehiculo_id),
  porton_id UUID REFERENCES app.portones(porton_id),
  lector_id UUID REFERENCES app.lectores(lector_id),
  fecha_hora TIMESTAMPTZ NOT NULL DEFAULT now(),
  resultado VARCHAR(12) NOT NULL CHECK (resultado IN ('ACEPTADO','RECHAZADO')),
  motivo_rechazo VARCHAR(120),
  origen VARCHAR(12) NOT NULL CHECK (origen IN ('ESCANER','MANUAL','WEB'))
);

CREATE INDEX IF NOT EXISTS idx_ingresos_persona_fecha ON app.ingresos(persona_id, fecha_hora DESC);

-- Helper: elegir rol vigente por prioridad
CREATE OR REPLACE FUNCTION app.fn_elegir_rol_vigente(p_persona UUID)
RETURNS SMALLINT
LANGUAGE sql AS $$
  SELECT rol_id FROM (
    SELECT ar.rol_id,
           CASE WHEN rp.nombre_rol = 'ESTUDIANTE' THEN 1
                WHEN rp.nombre_rol = 'EMPLEADO' THEN 2
                WHEN rp.nombre_rol = 'VISITA' THEN 3
                ELSE 9 END AS prioridad
    FROM app.autorizaciones ar
    JOIN app.roles_persona rp USING (rol_id)
    WHERE ar.persona_id = p_persona AND ar.estado = 'VIGENTE'
  ) t
  ORDER BY prioridad
  LIMIT 1;
$$;

-- Función principal: registrar ingreso
CREATE OR REPLACE FUNCTION app.registrar_ingreso(
  p_dni TEXT,
  p_tipo_ingreso TEXT,
  p_origen TEXT,
  p_placa TEXT DEFAULT NULL,
  p_porton_id UUID DEFAULT NULL,
  p_lector_id UUID DEFAULT NULL
) RETURNS TABLE (ingreso_id UUID, resultado TEXT, motivo TEXT)
LANGUAGE plpgsql AS $$
DECLARE
  v_persona UUID;
  v_rol SMALLINT;
  v_result TEXT := 'RECHAZADO';
  v_motivo TEXT := NULL;
  v_vehiculo UUID := NULL;
BEGIN
  -- Persona existe
  SELECT persona_id INTO v_persona FROM app.personas WHERE dni = p_dni;
  IF v_persona IS NULL THEN
    v_motivo := 'PERSONA_NO_REGISTRADA';
  ELSE
    -- ¿Suspensiones o bajas?
    IF EXISTS (SELECT 1 FROM app.suspensiones s WHERE s.persona_id = v_persona) THEN
      v_motivo := 'SUSPENDIDO';
    ELSIF EXISTS (SELECT 1 FROM app.bajas b WHERE b.persona_id = v_persona) THEN
      v_motivo := 'BAJA_RRHH';
    ELSE
      -- ¿Rol vigente?
      SELECT app.fn_elegir_rol_vigente(v_persona) INTO v_rol;
      IF v_rol IS NULL THEN
        v_motivo := 'SIN_AUTORIZACION_VIGENTE';
      ELSE
        -- Reglas por rol
        PERFORM 1;
        IF v_rol = (SELECT rol_id FROM app.roles_persona WHERE nombre_rol='ESTUDIANTE') THEN
          IF NOT EXISTS (SELECT 1 FROM app.estudiantes e WHERE e.persona_id=v_persona AND e.forma03_activa=TRUE) THEN
            v_motivo := 'FORMA03_INACTIVA';
          END IF;
        ELSIF v_rol = (SELECT rol_id FROM app.roles_persona WHERE nombre_rol='EMPLEADO') THEN
          IF NOT EXISTS (SELECT 1 FROM app.empleados e WHERE e.persona_id=v_persona AND e.contrato_activo=TRUE) THEN
            v_motivo := 'CONTRATO_INACTIVO';
          END IF;
        ELSIF v_rol = (SELECT rol_id FROM app.roles_persona WHERE nombre_rol='VISITA') THEN
          IF NOT EXISTS (SELECT 1 FROM app.visitas v WHERE v.persona_id=v_persona AND v.estado='ACTIVA' AND (v.fecha_fin IS NULL OR v.fecha_fin>now())) THEN
            v_motivo := 'VISITA_NO_VIGENTE';
          END IF;
        END IF;

        -- Reglas vehiculares
        IF v_motivo IS NULL AND p_tipo_ingreso = 'VEHICULAR' THEN
          IF p_placa IS NULL THEN
            v_motivo := 'PLACA_REQUERIDA';
          ELSE
            SELECT v.vehiculo_id INTO v_vehiculo
            FROM app.vehiculos v
            JOIN app.persona_vehiculos pv USING (vehiculo_id)
            WHERE pv.persona_id = v_persona AND pv.activo = TRUE AND v.placa = p_placa;
            IF v_vehiculo IS NULL THEN
              v_motivo := 'VEHICULO_NO_ASIGNADO';
            END IF;
          END IF;
        END IF;

        IF v_motivo IS NULL THEN
          v_result := 'ACEPTADO';
        END IF;
      END IF;
    END IF;
  END IF;

  INSERT INTO app.ingresos (persona_id, rol_id, tipo_ingreso, vehiculo_id, porton_id, lector_id, resultado, motivo_rechazo, origen)
  VALUES (v_persona, v_rol, p_tipo_ingreso, v_vehiculo, p_porton_id, p_lector_id, v_result, v_motivo, p_origen)
  RETURNING ingreso_id INTO ingreso_id;

  resultado := v_result;
  motivo := COALESCE(v_motivo, 'OK');
  RETURN;
END $$;

-- Historial de ingresos (filtros básicos)
CREATE OR REPLACE FUNCTION app.historial_ingresos(
  p_dni TEXT DEFAULT NULL,
  p_desde TIMESTAMPTZ DEFAULT now() - interval '30 days',
  p_hasta TIMESTAMPTZ DEFAULT now(),
  p_resultado TEXT DEFAULT NULL,
  p_limit INT DEFAULT 100
) RETURNS TABLE (
  fecha_hora TIMESTAMPTZ,
  dni TEXT,
  nombre_completo TEXT,
  rol TEXT,
  tipo_ingreso TEXT,
  placa TEXT,
  resultado TEXT,
  motivo TEXT
) LANGUAGE sql AS $$
  SELECT i.fecha_hora,
         p.dni,
         p.nombre_completo,
         rp.nombre_rol AS rol,
         i.tipo_ingreso,
         (SELECT v.placa FROM app.vehiculos v WHERE v.vehiculo_id = i.vehiculo_id) AS placa,
         i.resultado,
         COALESCE(i.motivo_rechazo, 'OK') AS motivo
  FROM app.ingresos i
  LEFT JOIN app.personas p ON p.persona_id = i.persona_id
  LEFT JOIN app.roles_persona rp ON rp.rol_id = i.rol_id
  WHERE i.fecha_hora >= COALESCE(p_desde, i.fecha_hora)
    AND i.fecha_hora <= COALESCE(p_hasta, i.fecha_hora)
    AND (p_dni IS NULL OR p.dni = p_dni)
    AND (p_resultado IS NULL OR i.resultado = p_resultado)
  ORDER BY i.fecha_hora DESC
  LIMIT COALESCE(p_limit, 100);
$$;
