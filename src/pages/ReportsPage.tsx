import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEPARTMENTS } from '@/types/attendance';
import { toast } from 'sonner';

const reports = [
  {
    id: '1',
    title: 'Reporte de Asistencia General',
    description: 'Resumen completo de asistencia de todos los departamentos',
    icon: FileSpreadsheet,
  },
  {
    id: '2',
    title: 'Reporte de Tardanzas',
    description: 'Detalle de tardanzas por empleado y departamento',
    icon: FileSpreadsheet,
  },
  {
    id: '3',
    title: 'Reporte de Horas Extra',
    description: 'Horas extra trabajadas por empleado',
    icon: FileSpreadsheet,
  },
  {
    id: '4',
    title: 'Reporte de Ausencias',
    description: 'Faltas justificadas y no justificadas',
    icon: FileSpreadsheet,
  },
];

const ReportsPage = () => {
  const handleDownload = (reportId: string) => {
    toast.success('Generando reporte...');
  };

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
            <h1 className="text-3xl font-bold gradient-text">Reportes</h1>
            <p className="text-muted-foreground mt-1">
              Genera y descarga reportes de asistencia
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 p-4 rounded-lg glass-card"
        >
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los departamentos</SelectItem>
              {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                <SelectItem key={key} value={key}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="glass-card hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <report.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={() => handleDownload(report.id)}
                    >
                      <Download className="w-4 h-4" />
                      Excel
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={() => handleDownload(report.id)}
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
