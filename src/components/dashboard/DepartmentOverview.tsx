import { motion } from 'framer-motion';
import { DEPARTMENTS, Department, DepartmentStats } from '@/types/attendance';
import { cn } from '@/lib/utils';
import { Users, UserX, Clock, Timer } from 'lucide-react';

interface DepartmentOverviewProps {
  stats: DepartmentStats[];
}

export function DepartmentOverview({ stats }: DepartmentOverviewProps) {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Resumen por Departamento</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const dept = DEPARTMENTS[stat.department];
          return (
            <motion.div
              key={stat.department}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="font-medium">{dept.name}</span>
                </div>
                <span className="text-2xl font-bold">{stat.attendanceRate}%</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{stat.presentToday}/{stat.totalEmployees}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserX className="w-4 h-4 text-destructive" />
                  <span className="text-muted-foreground">{stat.absences} faltas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-muted-foreground">{stat.tardies} tardanzas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-success" />
                  <span className="text-muted-foreground">{stat.overtimeHours}h extra</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.attendanceRate}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: dept.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
