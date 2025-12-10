import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Download, Send } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockEmployees, mockAttendanceRecords } from '@/data/mockData';
import { DEPARTMENTS } from '@/types/attendance';
import { toast } from 'sonner';

const AttendancePage = () => {
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRecords = mockAttendanceRecords.filter(record => {
    const employee = mockEmployees.find(e => e.id === record.employeeId);
    const matchesDept = departmentFilter === 'all' || employee?.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesDept && matchesStatus;
  });

  const handleValidate = (recordId: string) => {
    toast.success('Registro validado');
  };

  const handleReject = (recordId: string) => {
    toast.error('Registro rechazado');
  };

  const handleSendToManager = (recordIds: string[], department: string) => {
    toast.success(`${recordIds.length} registros enviados al jefe de ${DEPARTMENTS[department as keyof typeof DEPARTMENTS]?.name || department}`);
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
            <h1 className="text-3xl font-bold gradient-text">Control de Asistencia</h1>
            <p className="text-muted-foreground mt-1">
              Revisa y valida los registros de asistencia
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Periodo
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4"
        >
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="validated">Validados</SelectItem>
              <SelectItem value="rejected">Rechazados</SelectItem>
              <SelectItem value="justified">Justificados</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Attendance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AttendanceTable 
            records={filteredRecords}
            employees={mockEmployees}
            showActions={true}
            onValidate={handleValidate}
            onReject={handleReject}
            onSendToManager={handleSendToManager}
          />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AttendancePage;
