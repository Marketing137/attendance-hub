import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PayslipCard } from '@/components/payroll/PayslipCard';
import { CommissionCalculator } from '@/components/payroll/CommissionCalculator';
import { PaymentHistoryTable } from '@/components/payroll/PaymentHistoryTable';
import { mockPayslips, mockPaymentHistory, mockAdvisorMetrics, calculateFullCommission } from '@/data/mockPayrollData';
import { mockEmployees } from '@/data/mockData';
import { DEPARTMENTS } from '@/types/attendance';
import { Payslip } from '@/types/payroll';
import { useToast } from '@/hooks/use-toast';
import { Search, FileText, Calculator, History, Users, Mail, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PayrollPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState('2024-12');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [showPayslipDetail, setShowPayslipDetail] = useState<Payslip | null>(null);
  const [showCommissionDetail, setShowCommissionDetail] = useState<string | null>(null);

  const filteredPayslips = useMemo(() => {
    return mockPayslips.filter(payslip => {
      const matchesSearch = payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || payslip.department === selectedDepartment;
      const matchesMonth = payslip.month === selectedMonth;
      return matchesSearch && matchesDepartment && matchesMonth;
    });
  }, [searchTerm, selectedDepartment, selectedMonth]);

  const employeeHistory = useMemo(() => {
    if (!selectedEmployee) return [];
    return mockPaymentHistory.filter(h => h.employeeId === selectedEmployee);
  }, [selectedEmployee]);

  const commercialAdvisors = mockEmployees.filter(e => e.department === 'comercial');

  const handleSendEmail = (payslip: Payslip) => {
    toast({
      title: "Boleta enviada",
      description: `Se ha enviado la boleta a ${payslip.employeeName} (${mockEmployees.find(e => e.id === payslip.employeeId)?.email})`,
    });
  };

  const handlePrint = (payslip: Payslip) => {
    toast({
      title: "Imprimiendo boleta",
      description: `Generando PDF para ${payslip.employeeName}...`,
    });
  };

  const handleDownload = (payslip: Payslip) => {
    toast({
      title: "Descargando boleta",
      description: `Descargando boleta de ${payslip.employeeName}...`,
    });
  };

  const handleBulkSend = () => {
    const pendingPayslips = filteredPayslips.filter(p => p.status !== 'sent');
    toast({
      title: "Enviando boletas",
      description: `Enviando ${pendingPayslips.length} boletas por correo electrónico...`,
    });
  };

  // Stats
  const totalPayroll = filteredPayslips.reduce((sum, p) => sum + p.netPay, 0);
  const avgSalary = filteredPayslips.length > 0 ? totalPayroll / filteredPayslips.length : 0;
  const pendingCount = filteredPayslips.filter(p => p.status !== 'sent').length;
  const totalTardyDiscounts = filteredPayslips.reduce((sum, p) => sum + p.tardyDiscounts, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Boletas de Pago</h1>
            <p className="text-muted-foreground">
              Gestión de boletas, bonos, comisiones e historial de pagos
            </p>
          </div>
          <Button onClick={handleBulkSend} disabled={pendingCount === 0}>
            <Mail className="h-4 w-4 mr-2" />
            Enviar Todas ({pendingCount})
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileText className="h-4 w-4" />
                <span className="text-xs">Total Planilla</span>
              </div>
              <p className="text-2xl font-bold">S/ {totalPayroll.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{filteredPayslips.length} colaboradores</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs">Promedio Sueldo</span>
              </div>
              <p className="text-2xl font-bold">S/ {avgSalary.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Sueldo neto promedio</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Mail className="h-4 w-4" />
                <span className="text-xs">Pendientes de Envío</span>
              </div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Boletas por enviar</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-destructive mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Descuentos Tardanzas</span>
              </div>
              <p className="text-2xl font-bold text-destructive">S/ {totalTardyDiscounts.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Descuentos automáticos</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payslips" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payslips" className="gap-2">
              <FileText className="h-4 w-4" />
              Boletas
            </TabsTrigger>
            <TabsTrigger value="commissions" className="gap-2">
              <Calculator className="h-4 w-4" />
              Comisiones
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payslips" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar colaborador..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los departamentos</SelectItem>
                      {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                        <SelectItem key={key} value={key}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-12">Diciembre 2024</SelectItem>
                      <SelectItem value="2024-11">Noviembre 2024</SelectItem>
                      <SelectItem value="2024-10">Octubre 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Payslips Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPayslips.map(payslip => (
                <PayslipCard
                  key={payslip.id}
                  payslip={payslip}
                  onSendEmail={handleSendEmail}
                  onPrint={handlePrint}
                  onDownload={handleDownload}
                />
              ))}
            </div>

            {filteredPayslips.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No se encontraron boletas</p>
                  <p className="text-muted-foreground">Ajusta los filtros para ver más resultados</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comisiones de Asesores Comerciales</CardTitle>
                <CardDescription>
                  Cálculo basado en Plan Integral de Comisiones CCD 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asesor</TableHead>
                      <TableHead>Ventas</TableHead>
                      <TableHead>Recaudo NETO</TableHead>
                      <TableHead>RR</TableHead>
                      <TableHead>Gates</TableHead>
                      <TableHead>Comisión</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commercialAdvisors.map(advisor => {
                      const metrics = mockAdvisorMetrics.find(m => m.advisorId === advisor.id);
                      const calculation = metrics ? calculateFullCommission(metrics) : null;
                      
                      return (
                        <TableRow key={advisor.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{advisor.name}</p>
                              <p className="text-xs text-muted-foreground">{advisor.position}</p>
                            </div>
                          </TableCell>
                          <TableCell>{metrics?.validSales || 0}</TableCell>
                          <TableCell>S/ {(metrics?.totalNeto || 0).toFixed(2)}</TableCell>
                          <TableCell className={calculation?.rentableRevenue && calculation.rentableRevenue > 0 ? 'text-green-600' : 'text-destructive'}>
                            S/ {(calculation?.rentableRevenue || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={metrics?.gatesPassed === 4 ? 'default' : 'secondary'}>
                              {metrics?.gatesPassed || 0}/4
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-primary">
                            S/ {(calculation?.finalPayment || 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowCommissionDetail(advisor.id)}
                              disabled={!metrics}
                            >
                              Ver Detalle
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Commission Detail Dialog */}
            <Dialog open={!!showCommissionDetail} onOpenChange={() => setShowCommissionDetail(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Detalle de Comisiones - {mockEmployees.find(e => e.id === showCommissionDetail)?.name}
                  </DialogTitle>
                </DialogHeader>
                {showCommissionDetail && (
                  <CommissionCalculator 
                    calculation={calculateFullCommission(
                      mockAdvisorMetrics.find(m => m.advisorId === showCommissionDetail)!
                    )}
                  />
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
                <CardDescription>Selecciona un colaborador para ver su historial</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedEmployee || ''} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} - {DEPARTMENTS[emp.department].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedEmployee && (
                  <PaymentHistoryTable 
                    history={employeeHistory}
                    onViewPayslip={(id) => {
                      const payslip = mockPayslips.find(p => p.id === id);
                      if (payslip) setShowPayslipDetail(payslip);
                    }}
                    onDownload={(h) => {
                      toast({
                        title: "Descargando",
                        description: `Descargando boleta de ${format(new Date(h.month + '-01'), 'MMMM yyyy', { locale: es })}...`,
                      });
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {/* Payslip Detail Dialog */}
            <Dialog open={!!showPayslipDetail} onOpenChange={() => setShowPayslipDetail(null)}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Detalle de Boleta</DialogTitle>
                </DialogHeader>
                {showPayslipDetail && (
                  <PayslipCard 
                    payslip={showPayslipDetail} 
                    showActions={false}
                  />
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
