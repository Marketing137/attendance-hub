import { motion } from 'framer-motion';
import { UserPlus, Download } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { Button } from '@/components/ui/button';
import { mockEmployees } from '@/data/mockData';
import { toast } from 'sonner';

const EmployeesPage = () => {
  const handleViewEmployee = (employee: any) => {
    toast.info(`Viendo perfil de ${employee.name}`);
  };

  const handleContactEmployee = (employee: any) => {
    toast.info(`Contactando a ${employee.name}`);
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
            <h1 className="text-3xl font-bold gradient-text">Empleados</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona el directorio de personal
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Agregar Empleado
            </Button>
          </div>
        </motion.div>

        {/* Employee Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EmployeeTable 
            employees={mockEmployees}
            onViewEmployee={handleViewEmployee}
            onContactEmployee={handleContactEmployee}
          />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default EmployeesPage;
