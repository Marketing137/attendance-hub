import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Employee, Department, DEPARTMENTS, ContractType, EmployeeContract } from '@/types/attendance';
import { CONTRACT_TYPES } from '@/data/mockData';
import { Save, X, User, FileSignature } from 'lucide-react';
import { toast } from 'sonner';

const employeeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  documentId: z.string().min(8, 'DNI inválido').max(12),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  department: z.string(),
  position: z.string().optional(),
  hireDate: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']),
});

const contractSchema = z.object({
  type: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  salary: z.number().min(0, 'El salario debe ser positivo'),
  probationEndDate: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;
type ContractFormData = z.infer<typeof contractSchema>;

interface EmployeeEditFormProps {
  employee: Employee;
  contract?: EmployeeContract | null;
  onSave: (employee: Employee, contract?: Partial<EmployeeContract>) => void;
  onCancel: () => void;
}

export function EmployeeEditForm({ employee, contract, onSave, onCancel }: EmployeeEditFormProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);

  const employeeForm = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee.name,
      documentId: employee.documentId,
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department,
      position: employee.position || '',
      hireDate: employee.hireDate || '',
      status: employee.status || 'active',
    },
  });

  const contractForm = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      type: contract?.type || 'indefinido',
      startDate: contract?.startDate || '',
      endDate: contract?.endDate || '',
      salary: contract?.salary || 0,
      probationEndDate: contract?.probationEndDate || '',
    },
  });

  const handleSave = async () => {
    const employeeValid = await employeeForm.trigger();
    const contractValid = await contractForm.trigger();

    if (!employeeValid || !contractValid) {
      toast.error('Por favor, corrija los errores en el formulario');
      return;
    }

    setIsSaving(true);

    try {
      const employeeData = employeeForm.getValues();
      const contractData = contractForm.getValues();

      const updatedEmployee: Employee = {
        ...employee,
        name: employeeData.name,
        documentId: employeeData.documentId,
        email: employeeData.email || undefined,
        phone: employeeData.phone || undefined,
        department: employeeData.department as Department,
        position: employeeData.position || undefined,
        hireDate: employeeData.hireDate || undefined,
        status: employeeData.status,
      };

      const updatedContract: Partial<EmployeeContract> = {
        type: contractData.type as ContractType,
        startDate: contractData.startDate,
        endDate: contractData.endDate || undefined,
        salary: contractData.salary,
        probationEndDate: contractData.probationEndDate || undefined,
      };

      onSave(updatedEmployee, updatedContract);
      toast.success('Información del empleado actualizada');
    } catch (error) {
      toast.error('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal" className="gap-2">
            <User className="w-4 h-4" />
            Datos Personales
          </TabsTrigger>
          <TabsTrigger value="contract" className="gap-2">
            <FileSignature className="w-4 h-4" />
            Contrato
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                {...employeeForm.register('name')}
                placeholder="Nombre completo"
              />
              {employeeForm.formState.errors.name && (
                <p className="text-sm text-destructive">{employeeForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentId">DNI / Documento *</Label>
              <Input
                id="documentId"
                {...employeeForm.register('documentId')}
                placeholder="12345678"
              />
              {employeeForm.formState.errors.documentId && (
                <p className="text-sm text-destructive">{employeeForm.formState.errors.documentId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...employeeForm.register('email')}
                placeholder="correo@empresa.com"
              />
              {employeeForm.formState.errors.email && (
                <p className="text-sm text-destructive">{employeeForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...employeeForm.register('phone')}
                placeholder="+51 999 999 999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento *</Label>
              <Select
                value={employeeForm.watch('department')}
                onValueChange={(value) => employeeForm.setValue('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: dept.color }}
                        />
                        {dept.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                {...employeeForm.register('position')}
                placeholder="Cargo del empleado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Fecha de Ingreso</Label>
              <Input
                id="hireDate"
                type="date"
                {...employeeForm.register('hireDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={employeeForm.watch('status')}
                onValueChange={(value: 'active' | 'inactive' | 'on_leave') => employeeForm.setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="on_leave">Con Licencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contract" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractType">Tipo de Contrato *</Label>
              <Select
                value={contractForm.watch('type')}
                onValueChange={(value) => contractForm.setValue('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONTRACT_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        />
                        {type.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salario Mensual (S/.)</Label>
              <Input
                id="salary"
                type="number"
                {...contractForm.register('salary', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {contractForm.formState.errors.salary && (
                <p className="text-sm text-destructive">{contractForm.formState.errors.salary.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                type="date"
                {...contractForm.register('startDate')}
              />
              {contractForm.formState.errors.startDate && (
                <p className="text-sm text-destructive">{contractForm.formState.errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Fin</Label>
              <Input
                id="endDate"
                type="date"
                {...contractForm.register('endDate')}
              />
              <p className="text-xs text-muted-foreground">Dejar vacío para contratos indefinidos</p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="probationEndDate">Fin de Período de Prueba</Label>
              <Input
                id="probationEndDate"
                type="date"
                {...contractForm.register('probationEndDate')}
              />
              <p className="text-xs text-muted-foreground">Según Art. 23 del Reglamento Interno (3 meses para contratos indefinidos)</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          <X className="w-4 h-4 mr-1" />
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-1" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
}
