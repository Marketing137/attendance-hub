import { motion } from 'framer-motion';
import { Users, UserX, Clock, Timer, TrendingUp, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DepartmentOverview } from '@/components/dashboard/DepartmentOverview';
import { RecentUploads } from '@/components/dashboard/RecentUploads';
import { AttendanceCharts } from '@/components/dashboard/AttendanceCharts';
import { mockDepartmentStats, mockUploadedReports } from '@/data/mockData';

const Dashboard = () => {
  const totalEmployees = mockDepartmentStats.reduce((acc, stat) => acc + stat.totalEmployees, 0);
  const presentToday = mockDepartmentStats.reduce((acc, stat) => acc + stat.presentToday, 0);
  const totalAbsences = mockDepartmentStats.reduce((acc, stat) => acc + stat.absences, 0);
  const totalTardies = mockDepartmentStats.reduce((acc, stat) => acc + stat.tardies, 0);
  const totalOvertime = mockDepartmentStats.reduce((acc, stat) => acc + stat.overtimeHours, 0);
  const avgAttendance = Math.round(mockDepartmentStats.reduce((acc, stat) => acc + stat.attendanceRate, 0) / mockDepartmentStats.length);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Resumen de asistencia del personal
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Última actualización: Hoy, 09:30 AM</span>
          </div>
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

        {/* Charts */}
        <AttendanceCharts />

        {/* Department Overview & Recent Uploads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentOverview stats={mockDepartmentStats} />
          <RecentUploads reports={mockUploadedReports} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
