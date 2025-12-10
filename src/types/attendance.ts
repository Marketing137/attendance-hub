export type Department = 
  | 'comercial'
  | 'soporte'
  | 'marketing'
  | 'campanas'
  | 'ti'
  | 'digitalcollege';

export const DEPARTMENTS: Record<Department, { name: string; color: string; icon: string }> = {
  comercial: { name: 'Comercial', color: 'hsl(217 91% 50%)', icon: 'briefcase' },
  soporte: { name: 'Soporte', color: 'hsl(142 76% 36%)', icon: 'headphones' },
  marketing: { name: 'Marketing', color: 'hsl(326 100% 50%)', icon: 'megaphone' },
  campanas: { name: 'Campañas', color: 'hsl(38 92% 50%)', icon: 'target' },
  ti: { name: 'TI', color: 'hsl(188 94% 43%)', icon: 'code' },
  digitalcollege: { name: 'Digital College', color: 'hsl(262 83% 58%)', icon: 'graduation-cap' },
};

export interface Employee {
  id: string;
  documentId: string;
  name: string;
  department: Department;
  position?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  scheduledHours: number;
  workedHours: number;
  tardyCount: number;
  tardyMinutes: number;
  earlyLeaveCount: number;
  earlyLeaveMinutes: number;
  overtimeWeekday: number;
  overtimeHoliday: number;
  daysAttended: number;
  absences: number;
  permissions: number;
  status: 'pending' | 'validated' | 'rejected' | 'justified';
  justification?: Justification;
}

export interface Justification {
  id: string;
  recordId: string;
  type: 'medical' | 'personal' | 'work' | 'other';
  description: string;
  evidenceUrl?: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AttendanceMessage {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  department: Department;
  subject: string;
  message: string;
  attachmentUrl?: string;
  recordIds?: string[];
  createdAt: string;
  readAt?: string;
  replied?: boolean;
}

export interface DepartmentStats {
  department: Department;
  totalEmployees: number;
  presentToday: number;
  absences: number;
  tardies: number;
  overtimeHours: number;
  attendanceRate: number;
}

export interface EmployeeStats {
  employeeId: string;
  totalWorkDays: number;
  daysAttended: number;
  absences: number;
  tardies: number;
  totalTardyMinutes: number;
  earlyLeaves: number;
  totalOvertimeHours: number;
  attendanceRate: number;
}

export interface UploadedReport {
  id: string;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
  periodStart: string;
  periodEnd: string;
  recordCount: number;
  status: 'processing' | 'completed' | 'error';
}
