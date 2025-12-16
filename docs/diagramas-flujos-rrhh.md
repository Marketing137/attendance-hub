# Diagramas de Flujo - Sistema RRHH CCD

## 🎨 DIAGRAMA DE ARQUITECTURA DE ROLES

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PLATAFORMA RRHH CCD                          │
│                    (Sincronizada con Huellero ZKTeco)                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
         ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
         │  ADMIN RRHH  │  │ JEFE DE ÁREA │  │   EMPLEADO   │
         │  (3 users)   │  │  (6 users)   │  │  (40 users)  │
         └──────────────┘  └──────────────┘  └──────────────┘
                │                  │                  │
         ┌──────┴──────┐    ┌──────┴──────┐   ┌──────┴──────┐
         ▼             ▼    ▼             ▼   ▼             ▼
    ACCESO TOTAL   ÁREA    EQUIPO       SOL   PERFIL      BOLETAS
    TODO EL       ESPECÍF  PROPIO       ICIT  PERSONAL    PROPIAS
    SISTEMA        ICA                   UD
                                        ES
```

---

## 📋 CASOS DE USO POR ROL

### CASO 1: ADMIN RRHH - Día típico (Lunes 9:00 AM)

```
09:00 → Login al sistema
        ↓
09:05 → Dashboard: Ve alertas
        - 🔴 3 contratos vencen en 7 días
        - 🟡 8 tardanzas de hoy sin justificar
        - 🟠 2 requerimientos pendientes de aprobar
        ↓
09:10 → Va a "Carga de Asistencia"
        - Arrastra archivo del huellero "StandardReport_16-12-2024.xls"
        - Sistema procesa: 45 empleados marcaron hoy
        - Sistema detecta: 8 tardanzas, 2 faltas
        - Sistema calcula descuentos automáticamente
        ↓
09:15 → Va a "Mensajes"
        - Tiene 3 justificaciones de JEFES pendientes:
          * Jefe Comercial: "Juan llegó tarde por tráfico de accidente"
          * Jefe Marketing: "María tiene cita médica hoy"
          * Jefe Soporte: "Pedro compensará su tardanza en almuerzo"
        - Revisa cada una y decide:
          * Juan: APRUEBA (motivo válido)
          * María: APRUEBA (tiene certificado médico)
          * Pedro: RECHAZA (no cumple reglamento, debe compensar el mismo día antes de salida)
        ↓
09:30 → Va a "Contratos"
        - Filtra por "Vencen en 7 días"
        - Ve 3 contratos: Ana (Comercial), Carlos (TI), Sofía (Marketing)
        - Envía mensaje a cada JEFE:
          "El contrato de [Nombre] vence el [Fecha]. ¿Renuevan?"
        ↓
10:00 → Va a "Requerimientos"
        - Jefe de Soporte solicita contratar 1 técnico más
        - Revisa: Justificación sólida (volumen de tickets +40%)
        - APRUEBA y asigna reclutador
        ↓
10:30 → Continúa con tareas del día...
```

### CASO 2: JEFE DE ÁREA - Revisión matutina (Lunes 9:30 AM)

```
09:30 → Login al sistema
        ↓
09:35 → Dashboard: Ve su equipo (área Comercial - 8 personas)
        - 🔴 Juan llegó tarde (9:28 AM - descuento S/ 20)
        - 🟡 Luis todavía no marcó (ausente)
        - ✅ Los demás 6 llegaron puntual
        ↓
09:40 → Recibe notificación: "Juan solicita justificación"
        - Abre solicitud
        - Lee: "Hubo accidente en Av. Javier Prado, adjunto foto"
        - Ve foto de tráfico
        - Decide: APROBAR y envía a RRHH con comentario
          "Válido. Accidente mayor en la zona. Recomiendo aprobar"
        ↓
09:45 → Va a "Mi Equipo"
        - Filtra por "Hoy"
        - Ve que Luis no marcó
        - Llama por teléfono: Luis está enfermo
        - Registra en sistema: "Luis ausente por enfermedad. Certificado médico pendiente"
        ↓
10:00 → Revisa mensaje de RRHH:
        "El contrato de Ana vence el 23/12. ¿Renuevan?"
        ↓
10:05 → Evalúa desempeño de Ana:
        - Cumple metas
        - Buena actitud
        - No tiene sanciones
        - Decide: SÍ RENOVAR
        - Responde a RRHH: "Sí, renovar contrato de Ana por 1 año más"
        ↓
10:15 → Va a "Requerimientos"
        - Necesita contratar 2 asesores más por campaña de fin de año
        - Crea requerimiento:
          * Puesto: Asesor Comercial
          * Cantidad: 2
          * Justificación: "Proyección de ventas +50% en diciembre"
          * Presupuesto: S/ 3,000 c/u
          * Prioridad: ALTA
        - Envía a RRHH
        ↓
10:30 → Continúa gestionando ventas del día...
```

### CASO 3: EMPLEADO - Consulta de boleta (Día 1 del mes)

```
08:00 → Llega puntual, marca en huellero (9:00 AM exacto)
        ↓
18:30 → Sale del trabajo
        ↓
20:00 → En casa, abre laptop
        ↓
20:05 → Login al sistema
        ↓
20:10 → Dashboard: Ve notificación
        "Tu boleta de pago de noviembre está disponible"
        ↓
20:12 → Va a "Mis Boletas"
        - Ve lista de últimos 6 meses
        - Selecciona "Noviembre 2024"
        - Ve desglose:
          ──────────────────────────
          INGRESOS:
          Sueldo Base:        S/ 2,500
          Bono Movilidad:     S/   200
          Bono Alimentación:  S/   200
          Comisiones:         S/   450
          ──────────────────────────
          DESCUENTOS:
          AFP (12.5%):       -S/   312
          Tardanza (1x):     -S/    10
          ──────────────────────────
          SUELDO NETO:        S/ 3,028
          ══════════════════════════
        ↓
20:15 → Descarga PDF de la boleta
        ↓
20:20 → Ve descuento por tardanza (S/ 10)
        - Recuerda: Llegó a las 9:12 el día 15
        - Piensa: "No me di cuenta que fue tanto"
        - Revisa "Mi Asistencia"
        - Ve: "15/11 - 9:12 AM - Tardanza 12 min - Descuento S/ 10 - No justificada"
        ↓
20:25 → Cierra sesión
        - Mentalmente se propone: "Debo salir más temprano de casa"
```

---

## 🔄 FLUJO COMPLETO: TARDANZA CON COMPENSACIÓN

```
┌─────────────────────────────────────────────────────────────────┐
│ DÍA 1 - Martes 15/12 - EMPLEADO llega tarde                    │
└─────────────────────────────────────────────────────────────────┘

09:00 → Hora de entrada oficial
        ⏰ Tolerancia hasta 09:05
        │
09:12 → EMPLEADO marca en huellero (12 minutos de retraso)
        │
        ↓ [Huellero envía dato al sistema]
        │
09:13 → SISTEMA procesa automáticamente:
        ✓ Detecta: Llegada 09:12 (7 minutos después de tolerancia)
        ✓ Clasifica: Tardanza leve (09:06-09:29)
        ✓ Calcula: Descuento de S/ 10
        ✓ Estado: "Pendiente de justificación"
        │
        ↓ [Sistema envía notificaciones]
        │
09:14 → Notificaciones enviadas:
        📧 EMPLEADO: "Llegaste a las 09:12. Descuento: S/ 10. 
                      Puedes justificar ante tu jefe o compensar hoy hasta las 18:30"
        📧 JEFE: "Juan (Comercial) llegó tarde a las 09:12"
        📧 RRHH: "1 tardanza registrada hoy - Juan (Comercial)"
        │
        ↓
        │
┌─────┴─────────────────────────────────────────────────────────┐
│ OPCIÓN A: EMPLEADO compensa en el día                          │
└─────────────────────────────────────────────────────────────────┘
        │
13:00 → EMPLEADO almuerza solo 30 minutos (en vez de 1 hora)
        │
13:30 → EMPLEADO regresa y marca entrada de almuerzo
        │
18:42 → EMPLEADO marca salida (12 minutos después de su hora)
        │
        ↓ [Sistema valida compensación]
        │
18:43 → SISTEMA verifica:
        ✓ Salida: 18:42 (12 minutos después de 18:30)
        ✓ Tardanza: 12 minutos
        ✓ Compensación: 12 minutos ✅
        ✓ Actualiza estado: "Compensada"
        ✓ Elimina descuento: S/ 10 → S/ 0
        │
        ↓
        │
18:44 → Notificación a EMPLEADO:
        "✅ Compensaste tu tardanza. Descuento eliminado."

┌──────────────────────────────────────────────────────────────────┐
│ OPCIÓN B: EMPLEADO solicita justificación                       │
└──────────────────────────────────────────────────────────────────┘
        │
10:00 → EMPLEADO abre app → "Mi Asistencia"
        │
10:05 → EMPLEADO ve: "15/12 - 09:12 - Tardanza - S/ 10"
        │
10:06 → EMPLEADO hace clic: "Solicitar justificación"
        │
        ↓ [Formulario de justificación]
        │
10:08 → EMPLEADO completa:
        Motivo: "Accidente en Av. Javier Prado"
        Adjunta: Foto del tráfico
        Envía a: Su JEFE
        │
        ↓ [Sistema registra solicitud]
        │
10:09 → SISTEMA crea ticket de justificación:
        Estado: "Pendiente revisión del jefe"
        │
        ↓ [Notifica a JEFE]
        │
10:10 → JEFE recibe notificación:
        "Juan solicita justificar tardanza del 15/12"
        │
        ↓
        │
10:30 → JEFE abre sistema → "Justificaciones Pendientes"
        │
10:32 → JEFE revisa:
        - Ve foto del accidente
        - Valida: Accidente real en zona habitual de Juan
        - Decide: APROBAR
        - Agrega comentario: "Accidente verificable. Aprobar."
        │
        ↓ [JEFE envía a RRHH]
        │
10:33 → SISTEMA actualiza:
        Estado: "Aprobada por jefe - Pendiente RRHH"
        │
        ↓ [Notifica a RRHH]
        │
10:35 → RRHH recibe en bandeja de "Justificaciones"
        │
        ↓
        │
14:00 → RRHH revisa (después de almuerzo)
        │
14:05 → RRHH analiza:
        - Revisa foto
        - Ve aprobación del jefe
        - Consulta: ¿Juan tiene historial de tardanzas?
          * Sistema muestra: 1 tardanza en los últimos 3 meses
        - Decisión: APROBAR (motivo válido + buen historial)
        │
        ↓ [RRHH aprueba]
        │
14:06 → SISTEMA ejecuta:
        ✓ Estado: "Aprobada por RRHH"
        ✓ Elimina descuento: S/ 10 → S/ 0
        ✓ Marca registro: "Justificada - Accidente vial"
        │
        ↓ [Notificaciones finales]
        │
14:07 → Notificaciones enviadas:
        📧 EMPLEADO: "✅ Tu justificación fue aprobada. Sin descuento."
        📧 JEFE: "Justificación de Juan aprobada por RRHH"

┌──────────────────────────────────────────────────────────────────┐
│ OPCIÓN C: EMPLEADO no compensa ni justifica                     │
└──────────────────────────────────────────────────────────────────┘
        │
18:30 → EMPLEADO marca salida a su hora normal
        │
        ↓ [No compensó los 12 minutos]
        │
18:31 → SISTEMA verifica:
        ✗ No se compensó el tiempo
        ✗ No hay justificación aprobada
        ✓ Confirma descuento: S/ 10
        │
        ↓
        │
18:32 → Estado final: "Tardanza confirmada - Descuento aplicado"
        │
        ↓
        │
┌─────┴─────────────────────────────────────────────────────────┐
│ DÍA 30 - Fin de mes - GENERACIÓN DE NÓMINA                     │
└─────────────────────────────────────────────────────────────────┘
        │
        ↓ [Sistema consolida todo el mes]
        │
        → SISTEMA calcula para el EMPLEADO:
        
        Días trabajados:           20 días
        Tardanzas aplicadas:        1 (S/ 10)
        Faltas:                     0
        Horas extra:                0
        
        NÓMINA:
        Sueldo base:          S/ 2,500
        Bonos:                S/   400
        Descuento tardanza:  -S/    10  ← Este descuento
        AFP:                 -S/   312
        ─────────────────────────────
        SUELDO NETO:          S/ 2,578
        
        │
        ↓
        │
        → EMPLEADO recibe boleta con el descuento visible
```

---

## 📊 FLUJO: REINCIDENCIA DE TARDANZAS → SANCIÓN

```
┌─────────────────────────────────────────────────────────────────┐
│ SEMANA 1 - Reincidencia detectada                              │
└─────────────────────────────────────────────────────────────────┘

LUNES 09:15 → EMPLEADO llega tarde (Tardanza #1 del mes)
MARTES 09:10 → EMPLEADO llega tarde (Tardanza #2 del mes)
JUEVES 09:20 → EMPLEADO llega tarde (Tardanza #3 del mes)

              ↓ [Sistema detecta patrón]

VIERNES 08:00 → SISTEMA analiza:
                ⚠️ 3 tardanzas en 1 semana
                ⚠️ Ninguna justificada
                ⚠️ Descuentos: S/ 10 + S/ 10 + S/ 20 = S/ 40
                
                ↓ [Alerta automática]
                
                → SISTEMA envía alertas:
                  📧 JEFE: "⚠️ Juan tiene 3 tardanzas esta semana"
                  📧 RRHH: "⚠️ Reincidencia detectada - Juan (Comercial)"

              ↓ [JEFE revisa]

VIERNES 10:00 → JEFE abre sistema → "Alertas"
                - Ve las 3 tardanzas de Juan
                - Decide hablar con él
                
VIERNES 11:00 → JEFE conversa con EMPLEADO:
                "Juan, tienes 3 tardanzas esta semana. ¿Qué está pasando?"
                
                EMPLEADO explica: "Cambié mi ruta, está tomando más tiempo"
                
                JEFE advierte: "Debes salir más temprano. 
                                Esto puede escalar a una sanción formal."

              ↓ [JEFE registra conversación]

VIERNES 11:30 → JEFE va al sistema → "Mi Equipo" → Juan
                - Clic en "Registrar nota"
                - Escribe: "Conversación verbal sobre tardanzas. 
                            Advirtió que debe salir más temprano.
                            Próxima tardanza escalará a sanción formal."
                - Guarda registro

┌─────────────────────────────────────────────────────────────────┐
│ SEMANA 2 - Nueva tardanza → Sanción formal                     │
└─────────────────────────────────────────────────────────────────┘

MARTES 09:18 → EMPLEADO llega tarde OTRA VEZ (Tardanza #4 del mes)

              ↓ [Sistema escala automáticamente]

MARTES 09:19 → SISTEMA detecta:
               ⚠️⚠️ 4ta tardanza del mes
               ⚠️⚠️ Ya tuvo advertencia verbal
               
               → Alerta CRÍTICA a JEFE y RRHH:
                 "🔴 Juan (4ta tardanza) - Requiere sanción formal"

              ↓ [JEFE decide sancionar]

MARTES 14:00 → JEFE abre sistema → "Sanciones"
               - Clic en "Solicitar sanción"
               - Completa formulario:
               
               ┌─────────────────────────────────────┐
               │ FORMULARIO DE SOLICITUD DE SANCIÓN  │
               ├─────────────────────────────────────┤
               │ Empleado: Juan Pérez (Comercial)   │
               │                                     │
               │ Tipo de falta:                      │
               │ ☑ Tardanza reincidente              │
               │                                     │
               │ Detalles:                           │
               │ - 4 tardanzas en 2 semanas          │
               │ - Advertencia verbal (07/12)        │
               │ - Sin mejora en comportamiento      │
               │                                     │
               │ Sanción sugerida (por sistema):     │
               │ ⚠️ Amonestación escrita             │
               │                                     │
               │ Comentario del jefe:                │
               │ "A pesar de la conversación y      │
               │ advertencia verbal, continúa       │
               │ llegando tarde. Solicito           │
               │ amonestación escrita formal."      │
               │                                     │
               │ [Cancelar]  [Enviar a RRHH] ✓      │
               └─────────────────────────────────────┘
               
               - Envía solicitud a RRHH

              ↓ [RRHH recibe solicitud]

MARTES 15:00 → RRHH abre sistema → "Sanciones Pendientes"
               - Ve solicitud del JEFE
               - Revisa historial completo de Juan:
               
               ┌─────────────────────────────────────┐
               │ HISTORIAL - JUAN PÉREZ              │
               ├─────────────────────────────────────┤
               │ Tardanzas último mes:         4     │
               │ Tardanzas últimos 3 meses:    7     │
               │ Faltas últimos 6 meses:       2     │
               │ Sanciones previas:            0     │
               │ Desempeño general:         Bueno    │
               │ Tiempo en empresa:        14 meses  │
               └─────────────────────────────────────┘
               
               - Consulta reglamento:
                 Art. 50 - Faltas leves:
                 "Reincidencia en tardanzas (4+ en 1 mes)"
                 Sanción: Amonestación escrita
                 
               - Decisión: APROBAR sanción

              ↓ [RRHH aplica sanción]

MARTES 15:30 → RRHH completa proceso:
               - Genera documento de amonestación
               - Registra sanción en sistema
               - Programa reunión con Juan
               
               ┌─────────────────────────────────────┐
               │ AMONESTACIÓN ESCRITA #001-2024      │
               ├─────────────────────────────────────┤
               │ Fecha: 17/12/2024                   │
               │ Empleado: Juan Pérez                │
               │ Área: Comercial                     │
               │                                     │
               │ MOTIVO:                             │
               │ Reincidencia en tardanzas           │
               │ - 4 tardanzas en 2 semanas          │
               │ - Advertencia verbal sin efecto     │
               │                                     │
               │ SANCIÓN:                            │
               │ Amonestación escrita que queda en   │
               │ su legajo personal. Si persiste,    │
               │ procederá suspensión sin goce.      │
               │                                     │
               │ FIRMA:                              │
               │ _______________  _______________    │
               │ RRHH             Empleado           │
               └─────────────────────────────────────┘

              ↓ [Notificaciones finales]

MARTES 15:35 → SISTEMA envía:
               📧 EMPLEADO: "Citado a RRHH mañana 9 AM"
               📧 JEFE: "Sanción de Juan aprobada y procesada"
               
┌─────────────────────────────────────────────────────────────────┐
│ MIÉRCOLES - Reunión formal                                      │
└─────────────────────────────────────────────────────────────────┘

MIÉRCOLES 09:00 → Reunión: RRHH + EMPLEADO + JEFE
                  - RRHH entrega documento impreso
                  - Explica consecuencias
                  - EMPLEADO firma de conformidad
                  - Documento escaneado → Sistema
                  
                  ↓
                  
                  → SISTEMA actualiza:
                    ✓ Sanción aplicada: Amonestación escrita
                    ✓ Documento firmado adjunto
                    ✓ Visible en perfil del empleado
                    ✓ Afecta futuras evaluaciones
```

---

## 🎯 PANEL DE CONTROL POR ROL

### ADMIN RRHH - Dashboard principal

```
╔═══════════════════════════════════════════════════════════════════╗
║  CENTRO DE CAPACITACIÓN Y DESARROLLO - RRHH                       ║
║  Usuario: María González (Admin RRHH)             16/12/2024 09:15║
╚═══════════════════════════════════════════════════════════════════╝

┌─────────────── RESUMEN GLOBAL ────────────────┐
│                                                │
│  👥 Total empleados:        45                 │
│  ✅ Presentes hoy:          42  (93%)         │
│  🔴 Ausentes:                3  (7%)          │
│  ⏰ Tardanzas hoy:           8                 │
│                                                │
└────────────────────────────────────────────────┘

┌─────────────── ALERTAS CRÍTICAS ───────────────┐
│                                                 │
│  🔴 CONTRATOS POR VENCER (7 días)              │
│     • Ana García (Comercial) - Vence 23/12     │
│     • Carlos Ruiz (TI) - Vence 24/12           │
│     • Sofía Luna (Marketing) - Vence 25/12     │
│                                  [Ver todos]    │
│                                                 │
│  🟠 REINCIDENCIAS DE TARDANZAS                 │
│     • Juan Pérez (Comercial) - 4 esta semana   │
│     • Luis Torres (Soporte) - 3 esta semana    │
│                              [Revisar casos]    │
│                                                 │
│  🟡 JUSTIFICACIONES PENDIENTES (5)             │
│     • Jefe Comercial: 2 solicitudes            │
│     • Jefe Marketing: 1 solicitud              │
│     • Jefe Soporte: 2 solicitudes              │
│                              [Revisar ahora]    │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────── ASISTENCIA POR ÁREA (Hoy) ─────────┐
│                                                 │
│  Comercial     ████████░░  8/10  (2 tarde)    │
│  Soporte       ██████████  6/6   ✓            │
│  Marketing     ████████░░  5/6   (1 ausente)  │
│  Campañas      ████░░░░░░  2/5   (3 ausente)  │
│  TI            ██████████  4/4   ✓            │
│  Digital       ██████████  12/12 ✓            │
│                                                 │
└─────────────────────────────────────────────────┘

┌────────── ESTADÍSTICAS DEL MES ───────────────┐
│                                                 │
│  📊 Puntualidad:              87%              │
│  📉 Ausentismo:               4.2%             │
│  ⏱️ Horas extra:              342 hrs          │
│  💰 Descuentos aplicados:     S/ 850           │
│                                                 │
└─────────────────────────────────────────────────┘

[Cargar asistencia]  [Ver reportes]  [Configuración]
```

### JEFE DE ÁREA - Dashboard

```
╔═══════════════════════════════════════════════════════════════════╗
║  ÁREA COMERCIAL                                                   ║
║  Jefe: Roberto Díaz                            16/12/2024 09:30  ║
╚═══════════════════════════════════════════════════════════════════╝

┌───────────── MI EQUIPO (Hoy) ─────────────────┐
│                                                │
│  👥 Total: 10 colaboradores                    │
│  ✅ Presentes:  8  (80%)                       │
│  ⏰ Tardanzas:  2                              │
│  🔴 Ausentes:   0                              │
│                                                │
└────────────────────────────────────────────────┘

┌────────── REQUIERE ATENCIÓN ─────────────────┐
│                                               │
│  ⚠️ TARDANZAS HOY                            │
│     • Juan Pérez - 09:28 AM (S/ 20)          │
│       [Justificar] [Ver historial]            │
│                                               │
│     • Ana García - 09:12 AM (S/ 10)          │
│       ✓ Justificada por jefe                  │
│       Estado: Pendiente RRHH                  │
│                                               │
└───────────────────────────────────────────────┘

┌──────────── MENSAJES (3) ────────────────────┐
│                                               │
│  📧 RRHH: Contrato de Ana vence 23/12        │
│     → Responder: [Renovar] [No renovar]       │
│                                               │
│  📧 Juan Pérez: Solicita justificar tardanza │
│     → [Ver detalles]                          │
│                                               │
│  📧 RRHH: Requerimiento aprobado (2 asesores)│
│     → [Ver proceso]                           │
│                                               │
└───────────────────────────────────────────────┘

┌──────── DESEMPEÑO DEL EQUIPO ────────────────┐
│                                               │
│  📈 Ventas del mes:      S/ 145,000          │
│  🎯 Meta:                S/ 150,000 (97%)    │
│  ⭐ Top performer:       Ana García          │
│  ⚠️ Bajo rendimiento:    Luis Torres         │
│                                               │
└───────────────────────────────────────────────┘

[Ver equipo completo]  [Crear requerimiento]  [Reportes]
```

### EMPLEADO - Dashboard

```
╔═══════════════════════════════════════════════════════════════════╗
║  MI PORTAL                                                        ║
║  Juan Pérez - Asesor Comercial                 16/12/2024 20:00  ║
╚═══════════════════════════════════════════════════════════════════╝

┌──────────── MI PERFIL ───────────────────────┐
│                                               │
│  👤 Juan Pérez Gómez                         │
│  📧 juan.perez@ccd.edu.pe                    │
│  📱 987654321                                │
│  🏢 Área: Comercial                          │
│  👔 Puesto: Asesor Comercial                 │
│  📅 Ingreso: 01/10/2023 (14 meses)           │
│                                               │
│  📄 Contrato: Plazo fijo                     │
│     Vence: 01/10/2025 (9 meses restantes)    │
│                                               │
└───────────────────────────────────────────────┘

┌───────── MI ASISTENCIA (Diciembre) ──────────┐
│                                               │
│  ✅ Días asistidos:          12               │
│  ⏰ Tardanzas:                4               │
│  🔴 Faltas:                   0               │
│  ⏱️ Horas extra:              0               │
│                                               │
│  ⚠️ TARDANZAS ESTE MES:                      │
│  • 02/12 - 09:15 - S/ 10 (Compensada)       │
│  • 05/12 - 09:22 - S/ 20 (Justificada)      │
│  • 12/12 - 09:18 - S/ 20 (Aplicada)         │
│  • 16/12 - 09:28 - S/ 20 (Aplicada)         │
│                                               │
│  💰 Total descuentos:  S/ 40                 │
│                                               │
└───────────────────────────────────────────────┘

┌──────────── NOTIFICACIONES (2) ──────────────┐
│                                               │
│  📧 Tu boleta de nov está disponible          │
│     → [Ver boleta]                            │
│                                               │
│  ⚠️ Tienes 4 tardanzas este mes              │
│     → [Ver detalles]                          │
│                                               │
└───────────────────────────────────────────────┘

┌────────── MI ÚLTIMA BOLETA ──────────────────┐
│                                               │
│  📅 Noviembre 2024                            │
│                                               │
│  💵 Sueldo neto:     S/ 2,578                │
│  📥 Descuentos:      S/   332                │
│                                               │
│  [Ver detalle completo] [Descargar PDF]       │
│                                               │
└───────────────────────────────────────────────┘

[Mi contrato]  [Mis boletas]  [Reglamento]
```

---

## 💾 ESTRUCTURA DE BASE DE DATOS RECOMENDADA

```sql
-- TABLAS PRINCIPALES

users (usuarios del sistema)
├── id
├── email
├── password_hash
├── role (admin_rrhh, jefe_area, empleado)
├── employee_id (FK a employees)
└── last_login

employees (datos de empleados)
├── id
├── nombres
├── apellidos
├── dni
├── fecha_nacimiento
├── email_personal
├── telefono
├── direccion
├── area_id (FK a areas)
├── puesto
├── fecha_ingreso
├── estado (activo, inactivo, suspendido)
├── salario_base
├── cuenta_bancaria
└── foto_perfil

contracts (contratos)
├── id
├── employee_id (FK)
├── tipo (indefinido, plazo_fijo, practicas, etc)
├── fecha_inicio
├── fecha_fin
├── salario
├── archivo_pdf
└── estado (vigente, vencido, renovado)

attendance (asistencia diaria)
├── id
├── employee_id (FK)
├── fecha
├── hora_entrada
├── hora_salida
├── hora_entrada_almuerzo
├── hora_salida_almuerzo
├── minutos_tarde
├── minutos_compensados
├── estado (puntual, tarde, falta, justificado)
├── descuento_aplicado
└── observaciones

justifications (justificaciones)
├── id
├── attendance_id (FK)
├── solicitante_id (employee_id)
├── aprobador_jefe_id
├── aprobador_rrhh_id
├── motivo
├── archivo_adjunto
├── estado (pendiente_jefe, pendiente_rrhh, aprobada, rechazada)
├── comentario_jefe
├── comentario_rrhh
└── fecha_resolucion

sanctions (sanciones)
├── id
├── employee_id (FK)
├── tipo_falta (leve, grave, muy_grave)
├── articulo_reglamento
├── descripcion
├── tipo_sancion (verbal, escrita, suspension, despido)
├── dias_suspension
├── descuento_monto
├── solicitante_id (jefe)
├── aplicada_por_id (rrhh)
├── fecha_aplicacion
├── archivo_documento
└── estado

payroll (nómina mensual)
├── id
├── employee_id (FK)
├── periodo (mes-año)
├── dias_trabajados
├── sueldo_base
├── bonos_fijos
├── bonos_especiales
├── comisiones
├── horas_extra
├── total_ingresos
├── descuento_tardanzas
├── descuento_faltas
├── descuento_afp
├── descuento_renta
├── total_descuentos
├── sueldo_neto
├── archivo_boleta_pdf
├── fecha_generacion
└── fecha_pago

requirements (requerimientos de personal)
├── id
├── area_id (FK)
├── solicitante_id (jefe)
├── puesto_solicitado
├── cantidad
├── justificacion
├── presupuesto
├── perfil_requerido
├── prioridad (baja, media, alta, critica)
├── estado (borrador, enviado, aprobado, rechazado, en_proceso)
├── fecha_solicitud
├── aprobador_rrhh_id
└── fecha_resolucion

areas (áreas de la empresa)
├── id
├── nombre (Comercial, Soporte, Marketing, etc)
├── jefe_id (employee_id)
└── descripcion

messages (mensajería interna)
├── id
├── remitente_id (user_id)
├── destinatario_id
├── asunto
├── mensaje
├── fecha_envio
├── leido
└── tipo (notificacion, conversacion)

regulations (reglamento interno)
├── id
├── articulo
├── titulo
├── descripcion
├── categoria (horarios, faltas, sanciones)
└── vigencia
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### FASE 1: Autenticación y Roles (Semana 1-2)
- [ ] Sistema de login con email/password
- [ ] 3 roles: admin_rrhh, jefe_area, empleado
- [ ] Middleware de protección de rutas por rol
- [ ] Tabla users + employees relacionadas
- [ ] Redirección automática según rol después de login

### FASE 2: Dashboards Diferenciados (Semana 3-4)
- [ ] Dashboard Admin: Resumen global + alertas críticas
- [ ] Dashboard Jefe: Vista de su área + equipo
- [ ] Dashboard Empleado: Vista personal
- [ ] Filtros automáticos según rol (área, empleado)
- [ ] Notificaciones en tiempo real

### FASE 3: Permisos Granulares (Semana 5-6)
- [ ] Función helper: `can(user, 'action', 'resource')`
- [ ] Botones ocultos según permisos
- [ ] API endpoints protegidos por rol
- [ ] Validación en frontend Y backend
- [ ] Logs de intentos de acceso no autorizado

### FASE 4: Flujos de Aprobación (Semana 7-8)
- [ ] Justificaciones: empleado → jefe → rrhh
- [ ] Sanciones: jefe solicita → rrhh aplica
- [ ] Requerimientos: jefe crea → rrhh aprueba
- [ ] Estados de workflow en BD
- [ ] Notificaciones automáticas en cada paso

### FASE 5: Automatizaciones (Semana 9-12)
- [ ] Carga automática de huellero
- [ ] Cálculo automático de descuentos
- [ ] Alertas de contratos (30/15/7 días)
- [ ] Detección de reincidencias
- [ ] Generación de boletas
- [ ] Envío de emails

---

¿Te parece bien esta arquitectura? ¿Empezamos implementando el sistema de roles en tu proyecto de Lovable?
