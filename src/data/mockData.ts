import { Employee, AttendanceRecord, AttendanceMessage, Department, DepartmentStats, UploadedReport } from '@/types/attendance';

export const mockEmployees: Employee[] = [
  { id: '1', documentId: '75670401', name: 'Aracely Reque', department: 'comercial', position: 'Ejecutiva de Ventas' },
  { id: '2', documentId: '70862865', name: 'Lesly Lopez', department: 'comercial', position: 'Asistente Comercial' },
  { id: '3', documentId: '73870722', name: 'Zuleica Roque', department: 'marketing', position: 'Community Manager' },
  { id: '4', documentId: '76801962', name: 'Christian Maldon', department: 'ti', position: 'Desarrollador Frontend' },
  { id: '5', documentId: '71717084', name: 'Andrea Paz', department: 'soporte', position: 'Agente de Soporte' },
  { id: '6', documentId: '74394191', name: 'Leonardo Minaya', department: 'ti', position: 'DevOps Engineer' },
  { id: '7', documentId: '72491674', name: 'Alejandra Quispe', department: 'campanas', position: 'Coordinadora de Campañas' },
  { id: '8', documentId: '76749877', name: 'Daniel Castillo', department: 'digitalcollege', position: 'Instructor' },
  { id: '9', documentId: '72868766', name: 'Alejandro Barrientos', department: 'soporte', position: 'Supervisor de Soporte' },
  { id: '10', documentId: '75083276', name: 'Luis Manrique', department: 'marketing', position: 'Diseñador Gráfico' },
  { id: '11', documentId: '72209631', name: 'Miluska Mendivil', department: 'comercial', position: 'Gerente Comercial' },
  { id: '12', documentId: '76077253', name: 'Angel Plasencia', department: 'ti', position: 'Backend Developer' },
  { id: '13', documentId: '72976894', name: 'Angheli Trujillo', department: 'campanas', position: 'Ejecutiva de Campañas' },
  { id: '14', documentId: '71161185', name: 'Celeste Ramos', department: 'digitalcollege', position: 'Coordinadora Académica' },
  { id: '15', documentId: '73335122', name: 'Jazmin Ledesma', department: 'soporte', position: 'Agente Senior' },
];

export const mockAttendanceRecords: AttendanceRecord[] = mockEmployees.flatMap((emp, index) => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const hasAbsence = Math.random() < 0.1;
    const hasTardy = !hasAbsence && Math.random() < 0.15;
    const hasOvertime = !hasAbsence && Math.random() < 0.2;
    
    records.push({
      id: `${emp.id}-${date.toISOString().split('T')[0]}`,
      employeeId: emp.id,
      date: date.toISOString().split('T')[0],
      scheduledHours: 9,
      workedHours: hasAbsence ? 0 : (9 + (hasOvertime ? Math.random() * 3 : 0)),
      tardyCount: hasTardy ? 1 : 0,
      tardyMinutes: hasTardy ? Math.floor(Math.random() * 30) + 5 : 0,
      earlyLeaveCount: Math.random() < 0.05 ? 1 : 0,
      earlyLeaveMinutes: Math.random() < 0.05 ? Math.floor(Math.random() * 60) : 0,
      overtimeWeekday: hasOvertime ? Math.random() * 2 : 0,
      overtimeHoliday: 0,
      daysAttended: hasAbsence ? 0 : 1,
      absences: hasAbsence ? 1 : 0,
      permissions: 0,
      status: hasAbsence ? 'pending' : 'validated',
    });
  }
  
  return records;
});

export const mockMessages: AttendanceMessage[] = [
  {
    id: '1',
    fromUserId: 'hr-1',
    fromUserName: 'RRHH - María García',
    toUserId: 'manager-comercial',
    toUserName: 'Gerente Comercial',
    department: 'comercial',
    subject: 'Revisión de asistencia - Semana 48',
    message: 'Por favor revisar las faltas del equipo comercial de esta semana. Se requiere justificación para 2 colaboradores.',
    createdAt: new Date().toISOString(),
    recordIds: ['1-2024-12-02', '2-2024-12-03'],
  },
  {
    id: '2',
    fromUserId: 'manager-ti',
    fromUserName: 'Jefe TI - Carlos Ruiz',
    toUserId: 'hr-1',
    toUserName: 'RRHH',
    department: 'ti',
    subject: 'Justificación de horas extras',
    message: 'Adjunto la justificación de horas extras del equipo por el proyecto de migración.',
    attachmentUrl: '/evidence/overtime-dec.pdf',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    readAt: new Date().toISOString(),
    replied: true,
  },
];

export const mockDepartmentStats: DepartmentStats[] = [
  { department: 'comercial', totalEmployees: 25, presentToday: 23, absences: 2, tardies: 3, overtimeHours: 12, attendanceRate: 92 },
  { department: 'soporte', totalEmployees: 18, presentToday: 17, absences: 1, tardies: 2, overtimeHours: 8, attendanceRate: 94 },
  { department: 'marketing', totalEmployees: 12, presentToday: 12, absences: 0, tardies: 1, overtimeHours: 5, attendanceRate: 100 },
  { department: 'campanas', totalEmployees: 15, presentToday: 14, absences: 1, tardies: 1, overtimeHours: 15, attendanceRate: 93 },
  { department: 'ti', totalEmployees: 20, presentToday: 19, absences: 1, tardies: 0, overtimeHours: 25, attendanceRate: 95 },
  { department: 'digitalcollege', totalEmployees: 10, presentToday: 9, absences: 1, tardies: 2, overtimeHours: 3, attendanceRate: 90 },
];

export const mockUploadedReports: UploadedReport[] = [
  {
    id: '1',
    fileName: 'StandardReport_Nov23-Dec05.xls',
    uploadedAt: new Date().toISOString(),
    uploadedBy: 'María García',
    periodStart: '2024-11-23',
    periodEnd: '2024-12-05',
    recordCount: 65,
    status: 'completed',
  },
  {
    id: '2',
    fileName: 'StandardReport_Nov08-Nov22.xls',
    uploadedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    uploadedBy: 'María García',
    periodStart: '2024-11-08',
    periodEnd: '2024-11-22',
    recordCount: 65,
    status: 'completed',
  },
];
