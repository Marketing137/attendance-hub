-- ==========================================
-- SISTEMA RRHH CCD - FASE 1: CORE
-- ==========================================

-- 1. ENUM para roles del sistema
CREATE TYPE public.app_role AS ENUM ('admin_rrhh', 'jefe_area', 'empleado');

-- 2. ENUM para tipos de contrato
CREATE TYPE public.contract_type AS ENUM ('indefinido', 'plazo_fijo', 'practicas', 'temporal', 'por_obra');

-- 3. ENUM para estados de contrato
CREATE TYPE public.contract_status AS ENUM ('vigente', 'vencido', 'renovado', 'finalizado');

-- 4. ENUM para estados de asistencia
CREATE TYPE public.attendance_status AS ENUM ('puntual', 'tarde', 'falta', 'justificado', 'compensado');

-- 5. ENUM para niveles de infracción
CREATE TYPE public.infraction_level AS ENUM ('leve', 'grave', 'muy_grave');

-- 6. ENUM para tipos de sanción
CREATE TYPE public.sanction_type AS ENUM ('amonestacion_verbal', 'amonestacion_escrita', 'suspension', 'descuento', 'despido');

-- 7. ENUM para estados de justificación
CREATE TYPE public.justification_status AS ENUM ('pendiente_jefe', 'aprobada_jefe', 'rechazada_jefe', 'pendiente_rrhh', 'aprobada', 'rechazada');

-- ==========================================
-- TABLAS PRINCIPALES
-- ==========================================

-- Tabla de áreas/departamentos
CREATE TABLE public.areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  icono TEXT DEFAULT 'Building2',
  jefe_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de roles de usuario
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'empleado',
  area_id UUID REFERENCES public.areas(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Tabla de perfiles (datos básicos del usuario)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nombres TEXT,
  apellidos TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de empleados (datos laborales completos)
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  dni TEXT UNIQUE NOT NULL,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  email TEXT,
  email_personal TEXT,
  telefono TEXT,
  direccion TEXT,
  fecha_nacimiento DATE,
  area_id UUID REFERENCES public.areas(id),
  puesto TEXT NOT NULL,
  fecha_ingreso DATE NOT NULL,
  salario_base DECIMAL(10,2) NOT NULL DEFAULT 0,
  cuenta_bancaria TEXT,
  banco TEXT,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido', 'desvinculado')),
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de contratos
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  tipo contract_type NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  salario DECIMAL(10,2) NOT NULL,
  archivo_pdf TEXT,
  estado contract_status DEFAULT 'vigente',
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de asistencia diaria
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  fecha DATE NOT NULL,
  hora_entrada TIME,
  hora_salida TIME,
  hora_entrada_almuerzo TIME,
  hora_salida_almuerzo TIME,
  hora_entrada_programada TIME DEFAULT '09:00',
  hora_salida_programada TIME DEFAULT '18:30',
  minutos_tarde INTEGER DEFAULT 0,
  minutos_compensados INTEGER DEFAULT 0,
  horas_extra INTEGER DEFAULT 0,
  estado attendance_status DEFAULT 'puntual',
  descuento_aplicado DECIMAL(10,2) DEFAULT 0,
  observaciones TEXT,
  procesado_nomina BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(employee_id, fecha)
);

-- Tabla de justificaciones
CREATE TABLE public.justifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID REFERENCES public.attendance(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  motivo TEXT NOT NULL,
  archivo_adjunto TEXT,
  estado justification_status DEFAULT 'pendiente_jefe',
  aprobador_jefe_id UUID REFERENCES public.employees(id),
  aprobador_rrhh_id UUID REFERENCES public.employees(id),
  comentario_jefe TEXT,
  comentario_rrhh TEXT,
  fecha_aprobacion_jefe TIMESTAMPTZ,
  fecha_aprobacion_rrhh TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de sanciones
CREATE TABLE public.sanctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  tipo sanction_type NOT NULL,
  nivel_infraccion infraction_level NOT NULL,
  articulo_reglamento TEXT,
  descripcion TEXT NOT NULL,
  fecha DATE NOT NULL,
  fecha_inicio_suspension DATE,
  fecha_fin_suspension DATE,
  descuento_monto DECIMAL(10,2) DEFAULT 0,
  documento_url TEXT,
  solicitante_id UUID REFERENCES public.employees(id),
  aprobador_rrhh_id UUID REFERENCES public.employees(id),
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'ejecutada')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de mensajes internos
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remitente_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  destinatario_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  asunto TEXT NOT NULL,
  contenido TEXT NOT NULL,
  tipo TEXT DEFAULT 'general' CHECK (tipo IN ('general', 'justificacion', 'sancion', 'contrato', 'requerimiento')),
  referencia_id UUID,
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de cargas de asistencia (historial de archivos subidos)
CREATE TABLE public.attendance_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archivo_nombre TEXT NOT NULL,
  archivo_url TEXT,
  fecha_periodo_inicio DATE NOT NULL,
  fecha_periodo_fin DATE NOT NULL,
  total_registros INTEGER DEFAULT 0,
  tardanzas_detectadas INTEGER DEFAULT 0,
  faltas_detectadas INTEGER DEFAULT 0,
  subido_por UUID REFERENCES public.employees(id),
  procesado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- FUNCIONES
-- ==========================================

-- Función para verificar roles (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Función para obtener el área del usuario
CREATE OR REPLACE FUNCTION public.get_user_area(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT area_id
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Función para obtener el employee_id del usuario actual
CREATE OR REPLACE FUNCTION public.get_current_employee_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM public.employees
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- Función para calcular descuento por tardanza
CREATE OR REPLACE FUNCTION public.calculate_tardy_discount(minutos_tarde INTEGER)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Tolerancia de 5 minutos
  IF minutos_tarde <= 5 THEN
    RETURN 0;
  -- 6-29 minutos tarde (después de tolerancia) = S/ 10
  ELSIF minutos_tarde <= 29 THEN
    RETURN 10.00;
  -- 30-59 minutos tarde = S/ 20
  ELSIF minutos_tarde <= 59 THEN
    RETURN 20.00;
  -- 60+ minutos tarde = S/ 30
  ELSE
    RETURN 30.00;
  END IF;
END;
$$;

-- Función para procesar entrada y calcular tardanza automáticamente
CREATE OR REPLACE FUNCTION public.process_attendance_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_minutos_tarde INTEGER;
  v_hora_tolerancia TIME;
BEGIN
  -- Si se registra hora de entrada
  IF NEW.hora_entrada IS NOT NULL THEN
    -- Calcular tolerancia (hora programada + 5 minutos)
    v_hora_tolerancia := NEW.hora_entrada_programada + INTERVAL '5 minutes';
    
    -- Calcular minutos de tardanza
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
  
  -- Si no hay entrada, es falta
  IF NEW.hora_entrada IS NULL AND NEW.fecha < CURRENT_DATE THEN
    NEW.estado := 'falta';
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Trigger para procesar asistencia
CREATE TRIGGER trg_process_attendance
  BEFORE INSERT OR UPDATE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.process_attendance_entry();

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Triggers para updated_at
CREATE TRIGGER trg_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_areas_updated_at BEFORE UPDATE ON public.areas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_justifications_updated_at BEFORE UPDATE ON public.justifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_sanctions_updated_at BEFORE UPDATE ON public.sanctions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombres, apellidos)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombres', NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellidos', NEW.raw_user_meta_data->>'last_name', '')
  );
  
  -- Por defecto, asignar rol de empleado
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'empleado');
  
  RETURN NEW;
END;
$$;

-- Trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.justifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_uploads ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin_rrhh'));
CREATE POLICY "Admin can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin_rrhh'));

-- POLÍTICAS PARA profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin_rrhh'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- POLÍTICAS PARA areas (todos pueden ver, solo admin modifica)
CREATE POLICY "Everyone can view areas" ON public.areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage areas" ON public.areas FOR ALL USING (public.has_role(auth.uid(), 'admin_rrhh'));

-- POLÍTICAS PARA employees
CREATE POLICY "Admin can do everything with employees" ON public.employees FOR ALL USING (public.has_role(auth.uid(), 'admin_rrhh'));
CREATE POLICY "Jefe can view own area employees" ON public.employees FOR SELECT USING (
  public.has_role(auth.uid(), 'jefe_area') AND area_id = public.get_user_area(auth.uid())
);
CREATE POLICY "Employee can view own record" ON public.employees FOR SELECT USING (user_id = auth.uid());

-- POLÍTICAS PARA contracts
CREATE POLICY "Admin can manage all contracts" ON public.contracts FOR ALL USING (public.has_role(auth.uid(), 'admin_rrhh'));
CREATE POLICY "Jefe can view own area contracts" ON public.contracts FOR SELECT USING (
  public.has_role(auth.uid(), 'jefe_area') AND 
  employee_id IN (SELECT id FROM public.employees WHERE area_id = public.get_user_area(auth.uid()))
);
CREATE POLICY "Employee can view own contract" ON public.contracts FOR SELECT USING (
  employee_id = public.get_current_employee_id()
);

-- POLÍTICAS PARA attendance
CREATE POLICY "Admin can manage all attendance" ON public.attendance FOR ALL USING (public.has_role(auth.uid(), 'admin_rrhh'));
CREATE POLICY "Jefe can view own area attendance" ON public.attendance FOR SELECT USING (
  public.has_role(auth.uid(), 'jefe_area') AND 
  employee_id IN (SELECT id FROM public.employees WHERE area_id = public.get_user_area(auth.uid()))
);
CREATE POLICY "Employee can view own attendance" ON public.attendance FOR SELECT USING (
  employee_id = public.get_current_employee_id()
);

-- POLÍTICAS PARA justifications
CREATE POLICY "Admin can manage all justifications" ON public.justifications FOR ALL USING (public.has_role(auth.uid(), 'admin_rrhh'));
CREATE POLICY "Jefe can view and update own area justifications" ON public.justifications FOR SELECT USING (
  public.has_role(auth.uid(), 'jefe_area') AND 
  employee_id IN (SELECT id FROM public.employees WHERE area_id = public.get_user_area(auth.uid()))
);
CREATE POLICY "Jefe can update justifications" ON public.justifications FOR UPDATE USING (
  public.has_role(auth.uid(), 'jefe_area') AND 
  employee_id IN (SELECT id FROM public.employees WHERE area_id = public.get_user_area(auth.uid()))
);
CREATE POLICY "Employee can view own justifications" ON public.justifications FOR SELECT USING (
  employee_id = public.get_current_employee_id()
);
CREATE POLICY "Employee can create own justifications" ON public.justifications FOR INSERT WITH CHECK (
  employee_id = public.get_current_employee_id()
);

-- POLÍTICAS PARA sanctions
CREATE POLICY "Admin can manage all sanctions" ON public.sanctions FOR ALL USING (public.has_role(auth.uid(), 'admin_rrhh'));
CREATE POLICY "Jefe can view own area sanctions" ON public.sanctions FOR SELECT USING (
  public.has_role(auth.uid(), 'jefe_area') AND 
  employee_id IN (SELECT id FROM public.employees WHERE area_id = public.get_user_area(auth.uid()))
);
CREATE POLICY "Jefe can request sanctions" ON public.sanctions FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'jefe_area') AND 
  employee_id IN (SELECT id FROM public.employees WHERE area_id = public.get_user_area(auth.uid()))
);
CREATE POLICY "Employee can view own sanctions" ON public.sanctions FOR SELECT USING (
  employee_id = public.get_current_employee_id()
);

-- POLÍTICAS PARA messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  remitente_id = public.get_current_employee_id() OR destinatario_id = public.get_current_employee_id()
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
  remitente_id = public.get_current_employee_id()
);
CREATE POLICY "Admin can view all messages" ON public.messages FOR SELECT USING (public.has_role(auth.uid(), 'admin_rrhh'));

-- POLÍTICAS PARA attendance_uploads
CREATE POLICY "Admin can manage uploads" ON public.attendance_uploads FOR ALL USING (public.has_role(auth.uid(), 'admin_rrhh'));

-- ==========================================
-- DATOS INICIALES
-- ==========================================

-- Insertar áreas
INSERT INTO public.areas (nombre, color, icono) VALUES
  ('Comercial', '#EF4444', 'TrendingUp'),
  ('Soporte', '#3B82F6', 'Headphones'),
  ('Marketing', '#8B5CF6', 'Megaphone'),
  ('Campañas', '#F59E0B', 'Target'),
  ('TI', '#10B981', 'Monitor'),
  ('DigitalCollege', '#EC4899', 'GraduationCap');