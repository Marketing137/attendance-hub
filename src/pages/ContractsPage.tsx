import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, AlertTriangle, Calendar, Download, Users, CheckCircle, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { mockEmployees, mockContracts, CONTRACT_TYPES } from '@/data/mockData';
import { DEPARTMENTS } from '@/types/attendance';
import { format, differenceInDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const ContractsPage = () => {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [contractTypeFilter, setContractTypeFilter] = useState<string>('all');

  const getEmployee = (employeeId: string) => 
    mockEmployees.find(e => e.id === employeeId);

  const filteredContracts = mockContracts.filter(contract => {
    const employee = getEmployee(contract.employeeId);
    if (!employee) return false;

    const matchesSearch = 
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.documentId.includes(search);
    const matchesDepartment = departmentFilter === 'all' || contract.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = contractTypeFilter === 'all' || contract.type === contractTypeFilter;

    return matchesSearch && matchesDepartment && matchesStatus && matchesType;
  });

  const contractsExpiringSoon = mockContracts.filter(c => {
    if (!c.endDate) return false;
    const daysUntilEnd = differenceInDays(parseISO(c.endDate), new Date());
    return daysUntilEnd > 0 && daysUntilEnd <= 30;
  });

  const contractsByType = Object.entries(CONTRACT_TYPES).map(([type, info]) => ({
    type,
    ...info,
    count: mockContracts.filter(c => c.type === type).length,
  }));

  const getContractDaysRemaining = (endDate?: string) => {
    if (!endDate) return null;
    return differenceInDays(parseISO(endDate), new Date());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Activo</Badge>;
      case 'expired':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Vencido</Badge>;
      case 'pending_renewal':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Por Renovar</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
            <h1 className="text-3xl font-bold gradient-text">Contratos</h1>
            <p className="text-muted-foreground mt-1">
              Gestión de contratos y documentación del personal
            </p>
          </div>
          <Button className="gap-2" onClick={() => toast.success('Exportando contratos...')}>
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Contratos</p>
                    <p className="text-2xl font-bold">{mockContracts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Activos</p>
                    <p className="text-2xl font-bold">{mockContracts.filter(c => c.status === 'active').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-warning/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Por Vencer (30 días)</p>
                    <p className="text-2xl font-bold">{contractsExpiringSoon.length}</p>
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
                    <Clock className="w-6 h-6 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pendientes Renovación</p>
                    <p className="text-2xl font-bold">{mockContracts.filter(c => c.status === 'pending_renewal').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contracts by Type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Distribución por Tipo de Contrato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {contractsByType.map((item) => (
                  <div key={item.type} className="text-center p-4 rounded-lg bg-secondary/30">
                    <div 
                      className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <Users className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <p className="text-2xl font-bold">{item.count}</p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
              placeholder="Buscar por nombre o documento..."
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

          <Select value={contractTypeFilter} onValueChange={setContractTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(CONTRACT_TYPES).map(([key, type]) => (
                <SelectItem key={key} value={key}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="pending_renewal">Por Renovar</SelectItem>
              <SelectItem value="expired">Vencido</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Contracts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Inicio</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Documentos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => {
                    const employee = getEmployee(contract.employeeId);
                    const daysRemaining = getContractDaysRemaining(contract.endDate);
                    const dept = DEPARTMENTS[contract.department];
                    const contractType = CONTRACT_TYPES[contract.type];

                    return (
                      <TableRow key={contract.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {employee?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee?.name}</p>
                              <p className="text-sm text-muted-foreground">{contract.position}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            style={{ 
                              borderColor: `${contractType.color}50`,
                              color: contractType.color,
                              backgroundColor: `${contractType.color}10`
                            }}
                          >
                            {contractType.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: dept.color }}
                            />
                            {dept.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(parseISO(contract.startDate), 'dd MMM yyyy', { locale: es })}
                        </TableCell>
                        <TableCell>
                          {contract.endDate ? (
                            <div>
                              <p>{format(parseISO(contract.endDate), 'dd MMM yyyy', { locale: es })}</p>
                              {daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30 && (
                                <p className="text-xs text-warning">{daysRemaining} días restantes</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Indefinido</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={contract.documentsComplete ? 100 : 60} 
                              className="w-16 h-2"
                            />
                            <span className="text-xs text-muted-foreground">
                              {contract.documentsComplete ? '100%' : '60%'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toast.info('Ver contrato')}
                            >
                              Ver
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.info('Renovar contrato')}
                            >
                              Renovar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ContractsPage;