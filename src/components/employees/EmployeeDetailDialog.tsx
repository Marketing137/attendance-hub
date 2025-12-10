import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Employee, AttendanceRecord, DEPARTMENTS } from '@/types/attendance';
import { mockAttendanceRecords } from '@/data/mockData';

interface EmployeeDetailDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeDetailDialog({ employee, open, onOpenChange }: EmployeeDetailDialogProps) {
  const stats = useMemo(() => {
    if (!employee) return null;
    
    const records = mockAttendanceRecords.filter(r => r.employeeId === employee.id);
    
    const totalDays = records.length;
    const daysAttended = records.filter(r => r.daysAttended > 0).length;
    const absences = records.filter(r => r.absences > 0).length;
    const tardies = records.filter(r => r.tardyCount > 0).length;
    const totalTardyMinutes = records.reduce((sum, r) => sum + r.tardyMinutes, 0);
    const totalWorkedHours = records.reduce((sum, r) => sum + r.workedHours, 0);
    const totalOvertimeHours = records.reduce((sum, r) => sum + r.overtimeWeekday + r.overtimeHoliday, 0);
    const attendanceRate = totalDays > 0 ? (daysAttended / totalDays) * 100 : 0;
    
    return {
      totalDays,
      daysAttended,
      absences,
      tardies,
      totalTardyMinutes,
      totalWorkedHours: Math.round(totalWorkedHours * 10) / 10,
      totalOvertimeHours: Math.round(totalOvertimeHours * 10) / 10,
      attendanceRate: Math.round(attendanceRate),
      recentRecords: records.slice(0, 10),
    };
  }, [employee]);

  if (!employee || !stats) return null;

  const dept = DEPARTMENTS[employee.department];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const StatItem = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color?: string }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <div className={`p-2 rounded-lg ${color || 'bg-primary/10'}`}>
        <Icon className={`w-4 h-4 ${color ? 'text-white' : 'text-primary'}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Perfil del Empleado</DialogTitle>
        </DialogHeader>
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-4 pb-4"
        >
          <Avatar className="h-20 w-20">
            <AvatarFallback 
              className="text-2xl font-bold"
              style={{ backgroundColor: `${dept.color}20`, color: dept.color }}
            >
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold">{employee.name}</h2>
            <p className="text-muted-foreground">{employee.position || 'Sin cargo asignado'}</p>
            <Badge 
              variant="secondary"
              className="mt-2 gap-1.5"
              style={{ 
                backgroundColor: `${dept.color}20`,
                color: dept.color 
              }}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: dept.color }}
              />
              {dept.name}
            </Badge>
          </div>
        </motion.div>

        <Separator />

        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Información Personal
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Documento</p>
                <p className="font-medium">{employee.documentId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Departamento</p>
                <p className="font-medium">{dept.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{employee.email || 'No registrado'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="font-medium">{employee.phone || 'No registrado'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <Separator />

        {/* Attendance Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Estadísticas de Asistencia (Últimos 30 días)
          </h3>
          
          {/* Attendance Rate */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tasa de Asistencia</span>
              <span className="text-2xl font-bold text-primary">{stats.attendanceRate}%</span>
            </div>
            <Progress value={stats.attendanceRate} className="h-2" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatItem 
              icon={Calendar} 
              label="Días Laborados" 
              value={stats.daysAttended}
            />
            <StatItem 
              icon={XCircle} 
              label="Ausencias" 
              value={stats.absences}
              color="bg-red-500"
            />
            <StatItem 
              icon={AlertTriangle} 
              label="Tardanzas" 
              value={stats.tardies}
              color="bg-amber-500"
            />
            <StatItem 
              icon={TrendingUp} 
              label="Horas Extra" 
              value={`${stats.totalOvertimeHours}h`}
              color="bg-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Horas Trabajadas</span>
              </div>
              <p className="text-xl font-bold">{stats.totalWorkedHours}h</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Minutos de Tardanza</span>
              </div>
              <p className="text-xl font-bold">{stats.totalTardyMinutes} min</p>
            </div>
          </div>
        </motion.div>

        <Separator />

        {/* Recent Records */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Registros Recientes
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {stats.recentRecords.map((record) => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    record.absences > 0 ? 'bg-red-500' : 
                    record.tardyCount > 0 ? 'bg-amber-500' : 'bg-green-500'
                  }`} />
                  <span className="text-sm">{new Date(record.date).toLocaleDateString('es-PE', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  })}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {record.workedHours.toFixed(1)}h trabajadas
                  </span>
                  {record.absences > 0 && (
                    <Badge variant="destructive" className="text-xs">Ausente</Badge>
                  )}
                  {record.tardyCount > 0 && (
                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-500">
                      Tardanza {record.tardyMinutes}min
                    </Badge>
                  )}
                  {record.overtimeWeekday > 0 && (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-500">
                      +{record.overtimeWeekday.toFixed(1)}h extra
                    </Badge>
                  )}
                  {record.absences === 0 && record.tardyCount === 0 && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
