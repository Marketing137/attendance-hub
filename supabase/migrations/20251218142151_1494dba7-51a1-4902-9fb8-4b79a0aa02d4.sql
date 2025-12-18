-- Corregir funciones con search_path mutable
CREATE OR REPLACE FUNCTION public.calculate_tardy_discount(minutos_tarde INTEGER)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  IF minutos_tarde <= 5 THEN
    RETURN 0;
  ELSIF minutos_tarde <= 29 THEN
    RETURN 10.00;
  ELSIF minutos_tarde <= 59 THEN
    RETURN 20.00;
  ELSE
    RETURN 30.00;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.process_attendance_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_minutos_tarde INTEGER;
  v_hora_tolerancia TIME;
BEGIN
  IF NEW.hora_entrada IS NOT NULL THEN
    v_hora_tolerancia := NEW.hora_entrada_programada + INTERVAL '5 minutes';
    
    IF NEW.hora_entrada > v_hora_tolerancia THEN
      v_minutos_tarde := EXTRACT(EPOCH FROM (NEW.hora_entrada - NEW.hora_entrada_programada)) / 60;
      NEW.minutos_tarde := v_minutos_tarde;
      NEW.descuento_aplicado := public.calculate_tardy_discount(v_minutos_tarde);
      NEW.estado := 'tarde';
    ELSE
      NEW.minutos_tarde := 0;
      NEW.descuento_aplicado := 0;
      NEW.estado := 'puntual';
    END IF;
  END IF;
  
  IF NEW.hora_entrada IS NULL AND NEW.fecha < CURRENT_DATE THEN
    NEW.estado := 'falta';
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;