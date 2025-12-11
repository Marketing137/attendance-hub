import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Users, Clock, CheckCircle, XCircle, AlertCircle, Briefcase } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockRequirements, REQUIREMENT_STATUS, PRIORITY_LEVELS, CONTRACT_TYPES } from '@/data/mockData';
import { DEPARTMENTS } from '@/types/attendance';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const RequirementsPage = () => {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const filteredRequirements = mockRequirements.filter(req => {
    const matchesSearch = 
      req.position.toLowerCase().includes(search.toLowerCase()) ||
      req.requestedBy.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || req.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter;

    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority;
  });

  const stats = {
    total: mockRequirements.length,
    pending: mockRequirements.filter(r => r.status === 'pending').length,
    approved: mockRequirements.filter(r => r.status === 'approved').length,
    inProcess: mockRequirements.filter(r => r.status === 'in_process').length,
    totalPositions: mockRequirements.reduce((acc, r) => acc + r.quantity, 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'in_process': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleApprove = (id: string) => {
    toast.success('Requerimiento aprobado');
  };

  const handleReject = (id: string) => {
    toast.error('Requerimiento rechazado');
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
            <h1 className="text-3xl font-bold gradient-text">Requerimientos de Personal</h1>
            <p className="text-muted-foreground mt-1">
              Gestión de solicitudes de personal por área
            </p>
          </div>
          <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Requerimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nuevo Requerimiento de Personal</DialogTitle>
                <DialogDescription>
                  Complete el formulario para solicitar personal nuevo
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Departamento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                          <SelectItem key={key} value={key}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Puesto Requerido</Label>
                    <Input placeholder="Ej: Desarrollador Full Stack" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Cantidad</Label>
                    <Input type="number" defaultValue={1} min={1} />
                  </div>
                  <div className="space-y-2">
                    <Label>Prioridad</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIORITY_LEVELS).map(([key, level]) => (
                          <SelectItem key={key} value={key}>{level.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Contrato</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CONTRACT_TYPES).map(([key, type]) => (
                          <SelectItem key={key} value={key}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Salario Mínimo</Label>
                    <Input type="number" placeholder="S/. 0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Salario Máximo</Label>
                    <Input type="number" placeholder="S/. 0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Justificación</Label>
                  <Textarea 
                    placeholder="Explique por qué se necesita este personal..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Requisitos del Puesto</Label>
                  <Textarea 
                    placeholder="Liste los requisitos separados por comas..."
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => {
                    toast.success('Requerimiento enviado para aprobación');
                    setIsNewDialogOpen(false);
                  }}>
                    Enviar Solicitud
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Solicitudes</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aprobados</p>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">En Proceso</p>
                    <p className="text-2xl font-bold">{stats.inProcess}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posiciones Totales</p>
                    <p className="text-2xl font-bold">{stats.totalPositions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-4 p-4 rounded-lg glass-card"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por puesto o solicitante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                <SelectItem key={key} value={key}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(REQUIREMENT_STATUS).map(([key, status]) => (
                <SelectItem key={key} value={key}>{status.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {Object.entries(PRIORITY_LEVELS).map(([key, level]) => (
                <SelectItem key={key} value={key}>{level.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Requirements Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequirements.map((req, index) => {
            const dept = DEPARTMENTS[req.department];
            const status = REQUIREMENT_STATUS[req.status];
            const priority = PRIORITY_LEVELS[req.priority];
            const contractType = CONTRACT_TYPES[req.contractType];

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <Card className="glass-card hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${dept.color}20` }}
                        >
                          <Briefcase className="w-6 h-6" style={{ color: dept.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{req.position}</CardTitle>
                          <CardDescription>{dept.name} • {req.quantity} posición(es)</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge 
                          variant="outline"
                          style={{ 
                            borderColor: `${priority.color}50`,
                            color: priority.color,
                            backgroundColor: `${priority.color}10`
                          }}
                        >
                          {priority.name}
                        </Badge>
                        <Badge 
                          className="gap-1"
                          style={{ 
                            backgroundColor: `${status.color}15`,
                            color: status.color,
                            borderColor: `${status.color}30`
                          }}
                        >
                          {getStatusIcon(req.status)}
                          {status.name}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{req.justification}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {req.requirements.map((reqItem, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {reqItem}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          Solicitado: {format(parseISO(req.createdAt), 'dd MMM yyyy', { locale: es })}
                        </span>
                        {req.salaryRange && (
                          <span className="text-muted-foreground">
                            S/. {req.salaryRange.min.toLocaleString()} - {req.salaryRange.max.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {contractType.name}
                      </Badge>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleReject(req.id)}
                        >
                          Rechazar
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApprove(req.id)}
                        >
                          Aprobar
                        </Button>
                      </div>
                    )}

                    {req.approvedAt && (
                      <p className="text-xs text-muted-foreground">
                        Aprobado por {req.approvedBy} el {format(parseISO(req.approvedAt), 'dd MMM yyyy', { locale: es })}
                      </p>
                    )}
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

export default RequirementsPage;