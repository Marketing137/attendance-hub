import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockDepartmentStats } from '@/data/mockData';
import { DEPARTMENTS } from '@/types/attendance';

const DepartmentsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold gradient-text">Departamentos</h1>
          <p className="text-muted-foreground mt-1">
            Vista detallada por área de trabajo
          </p>
        </motion.div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDepartmentStats.map((stat, index) => {
            const dept = DEPARTMENTS[stat.department];
            return (
              <motion.div
                key={stat.department}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="glass-card hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${dept.color}20` }}
                        >
                          <Building2 
                            className="w-6 h-6" 
                            style={{ color: dept.color }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{dept.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {stat.totalEmployees} empleados
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary"
                        className="text-lg font-bold"
                        style={{ 
                          backgroundColor: `${dept.color}10`,
                          color: dept.color 
                        }}
                      >
                        {stat.attendanceRate}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tasa de asistencia</span>
                        <span className="font-medium">{stat.presentToday}/{stat.totalEmployees}</span>
                      </div>
                      <Progress 
                        value={stat.attendanceRate} 
                        className="h-2"
                        style={{ 
                          ['--progress-color' as any]: dept.color 
                        }}
                      />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-success" />
                          <span className="text-sm text-muted-foreground">Presentes</span>
                        </div>
                        <p className="text-2xl font-bold">{stat.presentToday}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-destructive" />
                          <span className="text-sm text-muted-foreground">Ausencias</span>
                        </div>
                        <p className="text-2xl font-bold">{stat.absences}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-warning" />
                          <span className="text-sm text-muted-foreground">Tardanzas</span>
                        </div>
                        <p className="text-2xl font-bold">{stat.tardies}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-info" />
                          <span className="text-sm text-muted-foreground">H. Extra</span>
                        </div>
                        <p className="text-2xl font-bold">{stat.overtimeHours}h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default DepartmentsPage;
