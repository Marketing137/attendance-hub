# Arquitectura de Plataforma de RRHH - CCD
## Sistema de Gestión Integral de Recursos Humanos

---

## 🎯 VISIÓN GENERAL

Plataforma centralizada que automatiza la gestión de asistencia, contratos, nómina y comunicación entre RRHH, jefes de área y empleados, eliminando procesos manuales y mejorando la trazabilidad.

---

## 👥 ARQUITECTURA DE ROLES Y PERMISOS

### 🔴 ROL 1: ADMINISTRADOR RRHH (Super Admin)

**Acceso Total** - Control completo del sistema

#### DASHBOARD
- Vista 360° de toda la empresa
- Estadísticas globales de asistencia (tardanzas, faltas, horas extra)
- Alertas críticas (contratos por vencer, sanciones pendientes, nómina)
- Análisis de rotación y ausentismo por área
- Indicadores de clima laboral
- Métricas de cumplimiento de reglamento interno

#### MÓDULOS CON ACCESO TOTAL

**1. GESTIÓN DE EMPLEADOS**
- ✅ Crear, editar y eliminar perfiles de empleados
- ✅ Cargar documentos (DNI, CV, antecedentes, certificados)
- ✅ Asignar roles y permisos
- ✅ Gestionar datos personales, bancarios y familiares
- ✅ Ver historial completo de cada empleado
- ✅ Exportar base de datos de personal

**2. CONTROL DE ASISTENCIA**
- ✅ Cargar reportes del huellero (automatización diaria)
- ✅ Ver asistencia de todos los empleados en tiempo real
- ✅ Aprobar/rechazar justificaciones de faltas y tardanzas
- ✅ Editar registros de asistencia con justificación
- ✅ Generar reportes por área, periodo, empleado
- ✅ Configurar horarios y turnos
- ✅ Gestionar tolerancias y excepciones

**3. GESTIÓN DE CONTRATOS**
- ✅ Crear, renovar y finalizar contratos
- ✅ Cargar y almacenar contratos firmados (PDF)
- ✅ Alertas automáticas de vencimientos (30/15/7 días)
- ✅ Gestionar adendas y modificaciones
- ✅ Ver contratos de toda la empresa
- ✅ Exportar reportes de contratos vigentes/vencidos

**4. SANCIONES Y DISCIPLINA**
- ✅ Aplicar sanciones según reglamento interno
- ✅ Calcular descuentos por tardanzas automáticamente
- ✅ Gestionar amonestaciones (verbal, escrita)
- ✅ Registrar suspensiones y despidos
- ✅ Ver historial completo de sanciones
- ✅ Generar reportes de incidencias

**5. NÓMINA Y BOLETAS DE PAGO**
- ✅ Calcular nómina completa (sueldo, bonos, comisiones, descuentos)
- ✅ Aplicar descuentos por tardanzas/faltas automáticamente
- ✅ Generar boletas de pago de todos los empleados
- ✅ Enviar boletas por email masivamente
- ✅ Gestionar bonos fijos y especiales
- ✅ Calcular comisiones de asesores comerciales según plan CCD
- ✅ Exportar planillas para bancos (Excel, TXT)
- ✅ Ver historial de pagos completo

**6. REQUERIMIENTOS DE PERSONAL**
- ✅ Ver todas las solicitudes de las áreas
- ✅ Aprobar/rechazar requerimientos
- ✅ Asignar prioridad y reclutadores
- ✅ Gestionar pipeline de reclutamiento
- ✅ Ver estadísticas de cobertura de puestos

**7. REGLAMENTO INTERNO**
- ✅ Publicar y actualizar artículos del reglamento
- ✅ Gestionar categorías de faltas (leves, graves, muy graves)
- ✅ Definir sanciones por tipo de falta
- ✅ Ver historial de cambios del reglamento

**8. MENSAJERÍA Y COMUNICACIÓN**
- ✅ Enviar mensajes a jefes y empleados
- ✅ Crear comunicados masivos
- ✅ Ver todas las conversaciones
- ✅ Moderar mensajes

**9. CONFIGURACIÓN DEL SISTEMA**
- ✅ Gestionar usuarios y roles
- ✅ Configurar integración con huellero
- ✅ Definir horarios laborales por área
- ✅ Configurar notificaciones automáticas
- ✅ Gestionar permisos y accesos
- ✅ Ver logs de auditoría

---

### 🟡 ROL 2: JEFE DE ÁREA (Manager)

**Acceso Limitado a su Área** - Control operativo de su equipo

#### DASHBOARD
- Vista de su área específica (Comercial, Soporte, Marketing, etc.)
- Asistencia de su equipo en tiempo real
- Alertas de su equipo (tardanzas, faltas, ausencias)
- Indicadores de productividad de su área
- Notificaciones de RRHH

#### MÓDULOS CON ACCESO LIMITADO

**1. EQUIPO DE TRABAJO**
- ✅ Ver lista completa de su equipo
- ✅ Ver información básica de sus colaboradores
- ✅ Ver contratos de su equipo (solo lectura)
- ❌ NO puede editar información personal
- ❌ NO puede crear/eliminar empleados
- ❌ NO puede ver empleados de otras áreas

**2. CONTROL DE ASISTENCIA**
- ✅ Ver asistencia de su equipo
- ✅ Justificar tardanzas de sus colaboradores (envía a RRHH)
- ✅ Aprobar permisos y licencias (envía a RRHH)
- ✅ Comentar registros de asistencia
- ✅ Exportar reporte de su área
- ❌ NO puede editar registros directamente
- ❌ NO puede cargar datos del huellero
- ❌ NO puede ver otras áreas

**3. GESTIÓN DE SANCIONES**
- ✅ Ver sanciones de su equipo
- ✅ Solicitar sanciones (envía a RRHH para aprobación)
- ✅ Comentar sobre incidencias
- ❌ NO puede aplicar sanciones directamente
- ❌ NO puede ver sanciones de otras áreas

**4. BOLETAS DE PAGO**
- ✅ Ver boletas de su equipo (solo sueldo base, sin detalles de bonos)
- ❌ NO puede ver salarios específicos
- ❌ NO puede generar boletas
- ❌ NO puede enviar boletas

**5. REQUERIMIENTOS DE PERSONAL**
- ✅ Crear solicitudes de personal para su área
- ✅ Ver estado de sus requerimientos
- ✅ Editar requerimientos en estado "borrador"
- ✅ Cancelar requerimientos propios
- ❌ NO puede aprobar requerimientos
- ❌ NO puede ver requerimientos de otras áreas

**6. MENSAJERÍA**
- ✅ Enviar mensajes a RRHH
- ✅ Comunicarse con su equipo
- ✅ Recibir notificaciones de asistencia
- ❌ NO puede enviar mensajes a otras áreas directamente

**7. REGLAMENTO INTERNO**
- ✅ Ver artículos del reglamento
- ✅ Consultar sanciones por tipo de falta
- ❌ NO puede editar el reglamento

---

### 🟢 ROL 3: EMPLEADO (Employee)

**Acceso Mínimo** - Solo su información personal

#### DASHBOARD
- Vista personal con su información
- Su asistencia del mes actual
- Sus próximas evaluaciones o vencimientos
- Mensajes de RRHH o su jefe

#### MÓDULOS CON ACCESO PERSONAL

**1. MI PERFIL**
- ✅ Ver su información personal
- ✅ Ver su contrato (solo lectura)
- ✅ Actualizar datos de contacto (requiere aprobación RRHH)
- ❌ NO puede ver información de otros empleados
- ❌ NO puede editar datos sin aprobación

**2. MI ASISTENCIA**
- ✅ Ver su propia asistencia
- ✅ Ver historial de tardanzas y faltas
- ✅ Solicitar justificación de faltas/tardanzas (envía a jefe)
- ✅ Ver descuentos aplicados
- ❌ NO puede editar registros
- ❌ NO puede ver asistencia de otros

**3. MIS BOLETAS DE PAGO**
- ✅ Ver sus boletas de pago
- ✅ Descargar boletas en PDF
- ✅ Ver historial de pagos
- ✅ Ver detalle de bonos y comisiones (si aplica)
- ❌ NO puede ver boletas de otros empleados

**4. MIS SANCIONES**
- ✅ Ver sus sanciones aplicadas
- ✅ Ver motivos y descuentos
- ❌ NO puede disputar directamente (debe comunicarse con jefe)

**5. REGLAMENTO INTERNO**
- ✅ Ver artículos del reglamento
- ✅ Consultar horarios y políticas
- ✅ Firmar acuse de recibo del reglamento

**6. MENSAJERÍA**
- ✅ Enviar mensajes a su jefe directo
- ✅ Recibir notificaciones de RRHH
- ❌ NO puede enviar mensajes a otros empleados directamente

---

## 📊 FLUJOS PRINCIPALES DEL SISTEMA

### FLUJO 1: CARGA DIARIA DE ASISTENCIA

```
[RRHH] Descarga reporte del huellero (Excel)
   ↓
[SISTEMA] Procesa archivo automáticamente
   ↓
[SISTEMA] Compara con horarios configurados
   ↓
[SISTEMA] Identifica: Tardanzas | Faltas | Horas Extra | Salidas Temprano
   ↓
[SISTEMA] Calcula descuentos automáticos según reglamento
   ↓
[SISTEMA] Notifica a JEFES sobre incidencias de su equipo
   ↓
[JEFE] Revisa y puede justificar tardanzas de su equipo
   ↓
[RRHH] Aprueba/Rechaza justificaciones
   ↓
[SISTEMA] Actualiza nómina con descuentos finales
```

### FLUJO 2: JUSTIFICACIÓN DE TARDANZA/FALTA

```
[EMPLEADO] Registra tardanza automáticamente al marcar
   ↓
[SISTEMA] Notifica al JEFE y al EMPLEADO
   ↓
[EMPLEADO] Solicita justificación a su JEFE (app)
   ↓
[JEFE] Revisa solicitud y puede:
   - Aprobar justificación → Envía a RRHH
   - Rechazar solicitud → Notifica a EMPLEADO
   ↓
[RRHH] Revisa justificación del JEFE y puede:
   - Aprobar → Elimina descuento
   - Rechazar → Mantiene descuento
   ↓
[SISTEMA] Notifica decisión final a EMPLEADO y JEFE
```

### FLUJO 3: APLICACIÓN DE SANCIONES

```
[JEFE] Detecta incidencia o falta (reincidencia de tardanzas)
   ↓
[JEFE] Registra incidencia en el sistema
   ↓
[SISTEMA] Sugiere nivel de sanción según reglamento
   ↓
[JEFE] Solicita sanción a RRHH con justificación
   ↓
[RRHH] Revisa caso completo:
   - Historial del empleado
   - Tipo de falta (leve, grave, muy grave)
   - Sanciones previas
   ↓
[RRHH] Aplica sanción según reglamento:
   - Amonestación verbal/escrita
   - Suspensión sin goce de haber
   - Descuento económico
   - Despido (casos extremos)
   ↓
[SISTEMA] Notifica a EMPLEADO y JEFE
   ↓
[SISTEMA] Actualiza historial y nómina si aplica
```

### FLUJO 4: GENERACIÓN DE NÓMINA MENSUAL

```
[Día 25 del mes] Sistema cierra periodo de asistencia
   ↓
[SISTEMA] Consolida para cada empleado:
   - Días trabajados
   - Tardanzas con descuento
   - Faltas injustificadas
   - Horas extra
   - Suspensiones
   ↓
[SISTEMA] Calcula nómina:
   - Sueldo base
   - (+) Bonos fijos (movilidad, alimentación)
   - (+) Bonos especiales (productividad, aniversario)
   - (+) Comisiones (asesores comerciales)
   - (+) Horas extra
   - (-) Descuentos por tardanzas/faltas
   - (-) AFP/ONP
   - (-) Renta 5ta categoría
   = Sueldo Neto
   ↓
[RRHH] Revisa y valida cálculos
   ↓
[RRHH] Genera boletas de pago (PDF)
   ↓
[SISTEMA] Envía boletas por email automáticamente
   ↓
[Día 30] RRHH genera archivos para bancos
   ↓
[Día 1] Pagos realizados
```

### FLUJO 5: REQUERIMIENTO DE PERSONAL

```
[JEFE] Identifica necesidad de contratar
   ↓
[JEFE] Crea requerimiento en sistema:
   - Puesto solicitado
   - Cantidad de personas
   - Justificación del negocio
   - Presupuesto estimado
   - Perfil requerido
   - Prioridad (baja, media, alta, crítica)
   ↓
[SISTEMA] Notifica a RRHH
   ↓
[RRHH] Revisa requerimiento:
   - Valida presupuesto con finanzas
   - Evalúa prioridad vs headcount
   - Decide: Aprobar / Rechazar / Pedir más info
   ↓
[Si aprobado] RRHH inicia proceso de reclutamiento:
   - Publica vacante
   - Filtra CVs
   - Coordina entrevistas con JEFE
   - Gestiona ofertas
   ↓
[Contratación] RRHH crea perfil de nuevo empleado
   ↓
[SISTEMA] Notifica a JEFE sobre incorporación
```

### FLUJO 6: ALERTA DE VENCIMIENTO DE CONTRATO

```
[30 días antes] Sistema detecta contrato próximo a vencer
   ↓
[SISTEMA] Notifica a RRHH (Alerta amarilla)
   ↓
[RRHH] Evalúa renovación con JEFE de área
   ↓
[15 días antes] Sistema escala alerta (Alerta naranja)
   ↓
[RRHH + JEFE] Deciden:
   - Renovar contrato
   - No renovar (fin de relación laboral)
   - Convertir a indefinido
   ↓
[7 días antes] Sistema escala alerta (Alerta roja)
   ↓
[Si renovación] RRHH genera nuevo contrato
   ↓
[RRHH] Carga contrato firmado al sistema
   ↓
[SISTEMA] Actualiza fecha de vencimiento
   ↓
[Si no renovación] RRHH inicia proceso de desvinculación
```

---

## 🔐 MATRIZ DE PERMISOS DETALLADA

| FUNCIONALIDAD | ADMIN RRHH | JEFE DE ÁREA | EMPLEADO |
|---------------|------------|--------------|----------|
| **EMPLEADOS** |
| Ver todos los empleados | ✅ | ❌ (solo su área) | ❌ (solo él mismo) |
| Crear empleado | ✅ | ❌ | ❌ |
| Editar empleado | ✅ | ❌ | ❌ |
| Eliminar empleado | ✅ | ❌ | ❌ |
| Ver contratos | ✅ | ✅ (su área) | ✅ (propio) |
| Editar contratos | ✅ | ❌ | ❌ |
| **ASISTENCIA** |
| Cargar datos huellero | ✅ | ❌ | ❌ |
| Ver asistencia todos | ✅ | ❌ (solo su área) | ❌ (solo propia) |
| Editar registros | ✅ | ❌ | ❌ |
| Justificar ausencias | ✅ | ✅ (solicita) | ✅ (solicita) |
| Aprobar justificaciones | ✅ | ❌ | ❌ |
| **SANCIONES** |
| Ver sanciones todas | ✅ | ❌ (solo su área) | ❌ (solo propias) |
| Aplicar sanciones | ✅ | ❌ | ❌ |
| Solicitar sanciones | ✅ | ✅ | ❌ |
| **NÓMINA** |
| Ver nómina completa | ✅ | ❌ | ❌ |
| Calcular nómina | ✅ | ❌ | ❌ |
| Generar boletas | ✅ | ❌ | ❌ |
| Ver boletas propias | ✅ | ✅ | ✅ |
| Enviar boletas | ✅ | ❌ | ❌ |
| **REQUERIMIENTOS** |
| Ver todos requerimientos | ✅ | ❌ (solo propios) | ❌ |
| Crear requerimiento | ✅ | ✅ | ❌ |
| Aprobar requerimiento | ✅ | ❌ | ❌ |
| **REGLAMENTO** |
| Ver reglamento | ✅ | ✅ | ✅ |
| Editar reglamento | ✅ | ❌ | ❌ |
| **MENSAJES** |
| Enviar a cualquiera | ✅ | ❌ | ❌ |
| Enviar a su área | ✅ | ✅ | ❌ |
| Enviar a su jefe | ✅ | ✅ | ✅ |
| **CONFIGURACIÓN** |
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Configurar sistema | ✅ | ❌ | ❌ |
| Ver auditoría | ✅ | ❌ | ❌ |

---

## 🚀 MÓDULOS ADICIONALES RECOMENDADOS

### 1. EVALUACIONES DE DESEMPEÑO
- **RRHH**: Configura periodos y criterios de evaluación
- **JEFE**: Evalúa a su equipo según KPIs
- **EMPLEADO**: Ve sus resultados y feedback

### 2. SOLICITUD DE PERMISOS Y VACACIONES
- **EMPLEADO**: Solicita permiso/vacaciones
- **JEFE**: Aprueba/rechaza (valida cobertura del equipo)
- **RRHH**: Valida días disponibles y aprueba final

### 3. CAPACITACIONES
- **RRHH**: Registra capacitaciones obligatorias/opcionales
- **JEFE**: Asigna capacitaciones a su equipo
- **EMPLEADO**: Ve sus capacitaciones y confirma asistencia

### 4. DOCUMENTOS Y POLÍTICAS
- **RRHH**: Sube manuales, políticas, formatos
- **JEFE/EMPLEADO**: Descarga documentos
- **SISTEMA**: Registra acuses de recibo

### 5. ENCUESTAS DE CLIMA LABORAL
- **RRHH**: Crea encuestas anónimas
- **JEFE/EMPLEADO**: Responde encuestas
- **RRHH**: Analiza resultados agregados

### 6. BENEFICIOS Y BIENESTAR
- **RRHH**: Gestiona beneficios (seguro, EPS, convenios)
- **EMPLEADO**: Ve sus beneficios activos
- **SISTEMA**: Alerta de vencimientos

---

## 📱 NOTIFICACIONES AUTOMÁTICAS

### RRHH RECIBE:
- 🔴 Contratos por vencer (30/15/7 días)
- 🟡 Reincidencia de tardanzas (3 tardanzas en 1 semana)
- 🟠 Faltas injustificadas
- 🟢 Nuevo requerimiento de personal
- 🔵 Justificaciones pendientes de revisar
- ⚪ Documentos de empleados por vencer

### JEFES RECIBEN:
- 🔴 Tardanza/falta de colaborador de su equipo
- 🟡 Solicitud de justificación de empleado
- 🟠 Aprobación/rechazo de RRHH sobre justificaciones
- 🔵 Contrato de su colaborador por vencer
- 🟢 Respuesta a requerimiento de personal

### EMPLEADOS RECIBEN:
- 🔴 Sanción aplicada
- 🟡 Descuento en boleta de pago
- 🟠 Contrato próximo a vencer
- 🟢 Boleta de pago disponible
- 🔵 Respuesta a solicitud de justificación

---

## 🔒 SEGURIDAD Y AUDITORÍA

### LOGS DEL SISTEMA
- Registro de todos los cambios críticos
- Quién, qué, cuándo (timestamp)
- Acciones registradas:
  - Edición de empleados
  - Aplicación de sanciones
  - Edición de registros de asistencia
  - Generación de nómina
  - Envío de boletas

### RESPALDOS
- Backup automático diario de base de datos
- Almacenamiento de documentos en la nube
- Versionado de contratos

---

## 💡 MEJORAS vs PROCESO MANUAL ACTUAL

| PROCESO | ANTES (Manual) | DESPUÉS (Plataforma) | MEJORA |
|---------|----------------|----------------------|--------|
| Retiro diario de huellero | RRHH va físicamente al dispositivo | Carga automática de Excel | 30 min/día → 2 min/día |
| Cálculo de descuentos | Manual en Excel con errores | Automático según reglamento | 100% precisión |
| Justificación de tardanzas | WhatsApp/email sin trazabilidad | Flujo formal con aprobaciones | Trazabilidad completa |
| Generación de boletas | Excel + Word + PDF manual | Generación automática + envío email | 4 horas → 10 minutos |
| Control de contratos | Excel sin alertas | Alertas automáticas 30/15/7 días | 0 vencimientos perdidos |
| Comunicación RRHH-Jefes | WhatsApp/llamadas | Mensajes internos + notificaciones | Registro permanente |
| Requerimientos personal | Email sin seguimiento | Sistema con estados y aprobaciones | Visibilidad total |

---

## 📊 MÉTRICAS DE ÉXITO

### KPIs OPERATIVOS
- Tiempo promedio de procesamiento de asistencia: < 5 minutos
- % de descuentos calculados correctamente: 100%
- Tiempo de respuesta a justificaciones: < 24 horas
- % de boletas enviadas a tiempo: 100%

### KPIs DE ADOPCIÓN
- % de empleados que revisan sus boletas en la app: > 80%
- % de jefes que justifican tardanzas en sistema: > 90%
- % de requerimientos gestionados en plataforma: 100%

### KPIs DE SATISFACCIÓN
- NPS de empleados sobre transparencia: > 70
- Reducción de consultas a RRHH: > 50%
- Tiempo ahorrado por RRHH: > 15 horas/semana

---

## 🛠️ IMPLEMENTACIÓN EN LOVABLE

### FASE 1: CORE (Semanas 1-4)
- ✅ Sistema de autenticación con roles
- ✅ Dashboards diferenciados por rol
- ✅ Carga de asistencia del huellero
- ✅ Cálculo automático de descuentos
- ✅ Base de datos de empleados

### FASE 2: GESTIÓN (Semanas 5-8)
- ✅ Módulo de sanciones
- ✅ Gestión de contratos con alertas
- ✅ Sistema de mensajería interna
- ✅ Flujos de aprobación

### FASE 3: NÓMINA (Semanas 9-12)
- ✅ Generación de boletas de pago
- ✅ Cálculo de comisiones comerciales
- ✅ Integración con bancos
- ✅ Envío automático de emails

### FASE 4: OPTIMIZACIÓN (Semanas 13-16)
- 🔄 Integración directa con API del huellero (eliminar Excel)
- 🔄 App móvil para marcado
- 🔄 Dashboard de analytics avanzado
- 🔄 Integración con sistema contable

---

## ✅ PRÓXIMOS PASOS INMEDIATOS

1. **Implementar sistema de roles en Lovable** (autenticación + permisos)
2. **Crear los 3 dashboards diferenciados** (Admin, Jefe, Empleado)
3. **Restringir acceso a módulos según rol**
4. **Agregar filtros automáticos** (jefe solo ve su área)
5. **Implementar flujo de justificaciones** con estados
6. **Testear con usuarios reales** de cada rol

---

¿Quieres que empiece a implementar el sistema de roles y permisos en tu proyecto de Lovable?
