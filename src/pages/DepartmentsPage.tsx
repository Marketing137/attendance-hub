import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Clock, FileText, ChevronRight, Search, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockDepartmentStats, mockEmployees, mockContracts, mockRequirements, CONTRACT_TYPES, REQUIREMENT_STATUS } from '@/data/mockData';
import { DEPARTMENTS, Department } from '@/types/attendance';
import { format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const DepartmentsPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [search, setSearch] = useState('');
  const [contractFilter, setContractFilter] = useState<string>('all');

  const getDepartmentEmployees = (dept: Department) => 
    mockEmployees.filter(e => e.department === dept);

  const getDepartmentContracts = (dept: Department) =>
    mockContracts.filter(c => c.department === dept);

  const getDepartmentRequirements = (dept: Department) =>
    mockRequirements.filter(r => r.department === dept);

  const getContractStatus = (endDate?: string) => {
    if (!endDate) return { label: 'Indefinido', color: 'hsl(142 76% 36%)' };
    const days = differenceInDays(parseISO(endDate), new Date());
    if (days < 0) return { label: 'Vencido', color: 'hsl(0 84% 60%)' };
    if (days <= 30) return { label: `${days} días`, color: 'hsl(38 92% 50%)' };
    return { label: format(parseISO(endDate), 'dd/MM/yyyy'), color: 'hsl(142 76% 36%)' };
  };

  const filteredEmployees = selectedDepartment 
    ? getDepartmentEmployees(selectedDepartment).filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.documentId.includes(search);
        const matchesContract = contractFilter === 'all' || emp.contractType === contractFilter;
        return matchesSearch && matchesContract;
      })
    : [];

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
            Vista detallada por área de trabajo, contratos y requerimientos
          </p>
        </motion.div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDepartmentStats.map((stat, index) => {
            const dept = DEPARTMENTS[stat.department];
            const contracts = getDepartmentContracts(stat.department);
            const requirements = getDepartmentRequirements(stat.department);
            const pendingRequirements = requirements.filter(r => r.status === 'pending' || r.status === 'in_process').length;

            return (
              <motion.div
                key={stat.department}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card 
                  className="glass-card hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedDepartment(stat.department)}
                >
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
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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

                    {/* Quick Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{contracts.length} contratos</span>
                      </div>
                      {pendingRequirements > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {pendingRequirements} requerimiento(s)
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Department Detail Dialog */}
        <Dialog open={!!selectedDepartment} onOpenChange={() => setSelectedDepartment(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            {selectedDepartment && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${DEPARTMENTS[selectedDepartment].color}20` }}
                    >
                      <Building2 
                        className="w-5 h-5" 
                        style={{ color: DEPARTMENTS[selectedDepartment].color }}
                      />
                    </div>
                    {DEPARTMENTS[selectedDepartment].name}
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="employees" className="mt-4">
                  <TabsList>
                    <TabsTrigger value="employees">Personal ({getDepartmentEmployees(selectedDepartment).length})</TabsTrigger>
                    <TabsTrigger value="contracts">Contratos ({getDepartmentContracts(selectedDepartment).length})</TabsTrigger>
                    <TabsTrigger value="requirements">Requerimientos ({getDepartmentRequirements(selectedDepartment).length})</TabsTrigger>
                  </TabsList>

                  {/* Employees Tab */}
                  <TabsContent value="employees" className="space-y-4">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar empleado..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={contractFilter} onValueChange={setContractFilter}>
                        <SelectTrigger className="w-40">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Contrato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {Object.entries(CONTRACT_TYPES).map(([key, type]) => (
                            <SelectItem key={key} value={key}>{type.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Empleado</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead>Puesto</TableHead>
                          <TableHead>Tipo Contrato</TableHead>
                          <TableHead>Vencimiento</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((emp) => {
                          const contractStatus = getContractStatus(emp.contractEndDate);
                          const contractType = emp.contractType ? CONTRACT_TYPES[emp.contractType] : null;

                          return (
                            <TableRow key={emp.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                      {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{emp.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{emp.documentId}</TableCell>
                              <TableCell>{emp.position}</TableCell>
                              <TableCell>
                                {contractType && (
                                  <Badge 
                                    variant="outline"
                                    style={{ 
                                      borderColor: `${contractType.color}50`,
                                      color: contractType.color 
                                    }}
                                  >
                                    {contractType.name}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <span style={{ color: contractStatus.color }}>
                                  {contractStatus.label}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-success/10 text-success border-success/20">
                                  {emp.status === 'active' ? 'Activo' : emp.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* Contracts Tab */}
                  <TabsContent value="contracts" className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Empleado</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Inicio</TableHead>
                          <TableHead>Fin</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Documentos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getDepartmentContracts(selectedDepartment).map((contract) => {
                          const employee = mockEmployees.find(e => e.id === contract.employeeId);
                          const contractType = CONTRACT_TYPES[contract.type];

                          return (
                            <TableRow key={contract.id}>
                              <TableCell className="font-medium">{employee?.name}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline"
                                  style={{ 
                                    borderColor: `${contractType.color}50`,
                                    color: contractType.color 
                                  }}
                                >
                                  {contractType.name}
                                </Badge>
                              </TableCell>
                              <TableCell>{format(parseISO(contract.startDate), 'dd/MM/yyyy')}</TableCell>
                              <TableCell>
                                {contract.endDate ? format(parseISO(contract.endDate), 'dd/MM/yyyy') : 'Indefinido'}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  className={
                                    contract.status === 'active' 
                                      ? 'bg-success/10 text-success' 
                                      : contract.status === 'pending_renewal'
                                      ? 'bg-warning/10 text-warning'
                                      : 'bg-destructive/10 text-destructive'
                                  }
                                >
                                  {contract.status === 'active' ? 'Activo' : 
                                   contract.status === 'pending_renewal' ? 'Por Renovar' : 'Vencido'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={contract.documentsComplete ? 100 : 60} className="w-16 h-2" />
                                  <span className="text-xs">{contract.documentsComplete ? '100%' : '60%'}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* Requirements Tab */}
                  <TabsContent value="requirements" className="space-y-4">
                    {getDepartmentRequirements(selectedDepartment).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No hay requerimientos de personal para este departamento
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {getDepartmentRequirements(selectedDepartment).map((req) => {
                          const status = REQUIREMENT_STATUS[req.status];
                          return (
                            <Card key={req.id} className="border">
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold">{req.position}</h4>
                                    <p className="text-sm text-muted-foreground">{req.quantity} posición(es)</p>
                                  </div>
                                  <Badge style={{ backgroundColor: `${status.color}15`, color: status.color }}>
                                    {status.name}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">{req.justification}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {req.requirements.map((r, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">{r}</Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default DepartmentsPage;