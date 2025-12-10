import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Check, 
  X, 
  FileText, 
  Send, 
  Clock, 
  AlertTriangle,
  Upload
} from 'lucide-react';
import { AttendanceRecord, Employee, DEPARTMENTS } from '@/types/attendance';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  employees: Employee[];
  showActions?: boolean;
  onValidate?: (recordId: string) => void;
  onReject?: (recordId: string) => void;
  onSendToManager?: (recordIds: string[], department: string) => void;
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-warning/10 text-warning border-warning/20' },
  validated: { label: 'Validado', color: 'bg-success/10 text-success border-success/20' },
  rejected: { label: 'Rechazado', color: 'bg-destructive/10 text-destructive border-destructive/20' },
  justified: { label: 'Justificado', color: 'bg-info/10 text-info border-info/20' },
};

export function AttendanceTable({ 
  records, 
  employees, 
  showActions = true,
  onValidate,
  onReject,
  onSendToManager
}: AttendanceTableProps) {
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [justificationOpen, setJustificationOpen] = useState(false);
  const [justificationData, setJustificationData] = useState({
    type: 'medical',
    description: '',
    file: null as File | null,
  });

  const getEmployee = (employeeId: string) => {
    return employees.find(e => e.id === employeeId);
  };

  const toggleRecord = (recordId: string) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSendToManager = () => {
    if (selectedRecords.length === 0) {
      toast.error('Selecciona al menos un registro');
      return;
    }
    toast.success(`Enviando ${selectedRecords.length} registros al jefe de área`);
    onSendToManager?.(selectedRecords, 'comercial');
    setSelectedRecords([]);
  };

  const handleJustify = () => {
    toast.success('Justificación enviada correctamente');
    setJustificationOpen(false);
    setJustificationData({ type: 'medical', description: '', file: null });
  };

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      {showActions && selectedRecords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20"
        >
          <span className="text-sm font-medium">
            {selectedRecords.length} registro(s) seleccionado(s)
          </span>
          <div className="flex-1" />
          <Button size="sm" variant="outline" onClick={() => setSelectedRecords([])}>
            Cancelar
          </Button>
          <Dialog open={justificationOpen} onOpenChange={setJustificationOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Justificar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Justificación</DialogTitle>
                <DialogDescription>
                  Adjunta evidencia para justificar las faltas o tardanzas seleccionadas.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Tipo de Justificación</Label>
                  <Select 
                    value={justificationData.type} 
                    onValueChange={(value) => setJustificationData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Descanso Médico</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="work">Comisión de Trabajo</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea 
                    placeholder="Describe el motivo de la justificación..."
                    value={justificationData.description}
                    onChange={(e) => setJustificationData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Evidencia (opcional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Arrastra un archivo o haz clic para subir
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG (máx. 5MB)
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setJustificationOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleJustify}>
                  Enviar Justificación
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" className="gap-2" onClick={handleSendToManager}>
            <Send className="w-4 h-4" />
            Enviar a Jefe
          </Button>
        </motion.div>
      )}

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {showActions && <TableHead className="w-12"></TableHead>}
              <TableHead>Empleado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Horas</TableHead>
              <TableHead className="text-center">Tardanzas</TableHead>
              <TableHead className="text-center">Faltas</TableHead>
              <TableHead className="text-center">H. Extra</TableHead>
              <TableHead>Estado</TableHead>
              {showActions && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.slice(0, 20).map((record, index) => {
              const employee = getEmployee(record.employeeId);
              const status = statusConfig[record.status];
              const dept = employee ? DEPARTMENTS[employee.department] : null;
              
              return (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className={cn(
                    'group hover:bg-muted/50 transition-colors',
                    selectedRecords.includes(record.id) && 'bg-primary/5'
                  )}
                >
                  {showActions && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => toggleRecord(record.id)}
                        className="rounded border-border"
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{employee?.name || 'Desconocido'}</span>
                      {dept && (
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: dept.color }}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(record.date), "d MMM yyyy", { locale: es })}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      record.workedHours < record.scheduledHours && 'text-warning'
                    )}>
                      {record.workedHours.toFixed(1)}h
                    </span>
                    <span className="text-muted-foreground"> / {record.scheduledHours}h</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {record.tardyCount > 0 ? (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        <Clock className="w-3 h-3 mr-1" />
                        {record.tardyMinutes} min
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.absences > 0 ? (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {record.absences}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.overtimeWeekday > 0 ? (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        +{record.overtimeWeekday.toFixed(1)}h
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-success hover:text-success hover:bg-success/10"
                          onClick={() => onValidate?.(record.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onReject?.(record.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
