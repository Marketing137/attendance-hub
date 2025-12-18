import { motion } from 'framer-motion';
import { Users, UserX, Clock, Timer, TrendingUp, Calendar, AlertTriangle, FileText, MessageSquare } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { DepartmentOverview } from '@/components/dashboard/DepartmentOverview';
import { RecentUploads } from '@/components/dashboard/RecentUploads';
import { AttendanceCharts } from '@/components/dashboard/AttendanceCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockDepartmentStats, mockUploadedReports } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();
  
  const totalEmployees = mockDepartmentStats.reduce((acc, stat) => acc + stat.totalEmployees, 0);
  const presentToday = mockDepartmentStats.reduce((acc, stat) => acc + stat.presentToday, 0);
  const totalAbsences = mockDepartmentStats.reduce((acc, stat) => acc + stat.absences, 0);
  const totalTardies = mockDepartmentStats.reduce((acc, stat) => acc + stat.tardies, 0);
  const totalOvertime = mockDepartmentStats.reduce((acc, stat) => acc + stat.overtimeHours, 0);
  const avgAttendance = Math.round(mockDepartmentStats.reduce((acc, stat) => acc + stat.attendanceRate, 0) / mockDepartmentStats.length);

  // Mock alerts
  const alerts = [
    { type: 'error', icon: FileText, message: '3 contratos vencen en 7 días', action: '/contracts' },
    { type: 'warning', icon: Clock, message: '8 tardanzas de hoy sin justificar', action: '/attendance' },
    { type: 'info', icon: MessageSquare, message: '5 justificaciones pendientes de revisar', action: '/messages' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard Admin RRHH</h1>
          <p className="text-muted-foreground mt-1">
            Vista 360° de toda la empresa
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Última actualización: Hoy, {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </motion.div>

      {/* Critical Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Alertas Críticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={alert.type === 'error' ? 'destructive' : alert.type === 'warning' ? 'secondary' : 'outline'}>
                    {alert.type === 'error' ? '🔴' : alert.type === 'warning' ? '🟡' : '🟠'}
                  </Badge>
                  <span className="text-sm">{alert.message}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate(alert.action)}>
                  Ver
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Empleados"
          value={totalEmployees}
          icon={Users}
          variant="primary"
          delay={0}
        />
        <StatCard
          title="Presentes Hoy"
          value={presentToday}
          subtitle={`${Math.round((presentToday/totalEmployees)*100)}% del total`}
          icon={Users}
          variant="success"
          delay={0.1}
        />
        <StatCard
          title="Ausencias"
          value={totalAbsences}
          icon={UserX}
          variant="destructive"
          trend={{ value: 12, isPositive: false }}
          delay={0.2}
        />
        <StatCard
          title="Tardanzas"
          value={totalTardies}
          icon={Clock}
          variant="warning"
          delay={0.3}
        />
        <StatCard
          title="Horas Extra"
          value={`${totalOvertime}h`}
          icon={Timer}
          variant="default"
          delay={0.4}
        />
        <StatCard
          title="Tasa Asistencia"
          value={`${avgAttendance}%`}
          icon={TrendingUp}
          variant="primary"
          trend={{ value: 3, isPositive: true }}
          delay={0.5}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        <Button onClick={() => navigate('/upload')}>
          Cargar Asistencia
        </Button>
        <Button variant="outline" onClick={() => navigate('/contracts')}>
          Ver Contratos
        </Button>
        <Button variant="outline" onClick={() => navigate('/messages')}>
          Justificaciones Pendientes
        </Button>
        <Button variant="outline" onClick={() => navigate('/reports')}>
          Generar Reportes
        </Button>
      </motion.div>

      {/* Charts */}
      <AttendanceCharts />

      {/* Department Overview & Recent Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentOverview stats={mockDepartmentStats} />
        <RecentUploads reports={mockUploadedReports} />
      </div>
    </div>
  );
}