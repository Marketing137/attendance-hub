import { motion } from 'framer-motion';
import { User, Clock, FileText, Calendar, AlertCircle, CheckCircle, Download, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock employee data
const employeeData = {
  nombres: 'Juan',
  apellidos: 'Pérez Gómez',
  email: 'juan.perez@ccd.edu.pe',
  telefono: '987654321',
  area: 'Comercial',
  puesto: 'Asesor Comercial',
  fechaIngreso: '01/10/2023',
  mesesEmpresa: 14,
  contrato: {
    tipo: 'Plazo Fijo',
    vence: '01/10/2025',
    mesesRestantes: 9,
  },
};

const attendanceThisMonth = {
  diasAsistidos: 12,
  tardanzas: 4,
  faltas: 0,
  horasExtra: 0,
  descuentoTotal: 40,
  tardanzasDetalle: [
    { fecha: '02/12', hora: '09:15', descuento: 10, estado: 'compensada' },
    { fecha: '05/12', hora: '09:22', descuento: 20, estado: 'justificada' },
    { fecha: '12/12', hora: '09:18', descuento: 20, estado: 'aplicada' },
    { fecha: '16/12', hora: '09:28', descuento: 20, estado: 'aplicada' },
  ],
};

const lastPayslip = {
  periodo: 'Noviembre 2024',
  sueldoNeto: 2578,
  descuentos: 332,
};

const notifications = [
  { id: '1', type: 'payslip', message: 'Tu boleta de nov está disponible', action: '/payroll' },
  { id: '2', type: 'warning', message: 'Tienes 4 tardanzas este mes', action: '/attendance' },
];

export function EmpleadoDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Mi Portal</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido, {employeeData.nombres}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </motion.div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          {notifications.map((notif) => (
            <Card key={notif.id} className={notif.type === 'warning' ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-primary/50 bg-primary/5'}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {notif.type === 'payslip' ? (
                    <FileText className="w-5 h-5 text-primary" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="text-sm">{notif.message}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => navigate(notif.action)}>
                  Ver
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Mi Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-xl">
                    {employeeData.nombres[0]}{employeeData.apellidos[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{employeeData.nombres} {employeeData.apellidos}</h3>
                  <p className="text-muted-foreground">{employeeData.puesto}</p>
                  <Badge variant="outline" className="mt-1">{employeeData.area}</Badge>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{employeeData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Ingreso: {employeeData.fechaIngreso} ({employeeData.mesesEmpresa} meses)</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Contrato: {employeeData.contrato.tipo}</span>
                  <Badge variant="outline">{employeeData.contrato.mesesRestantes} meses</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Vence: {employeeData.contrato.vence}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance This Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Mi Asistencia (Diciembre)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-green-500/10">
                  <p className="text-2xl font-bold text-green-500">{attendanceThisMonth.diasAsistidos}</p>
                  <p className="text-xs text-muted-foreground">Días asistidos</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-500/10">
                  <p className="text-2xl font-bold text-yellow-500">{attendanceThisMonth.tardanzas}</p>
                  <p className="text-xs text-muted-foreground">Tardanzas</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Detalle de tardanzas:</p>
                {attendanceThisMonth.tardanzasDetalle.map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                    <span>{t.fecha} - {t.hora}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">S/ {t.descuento}</span>
                      <Badge 
                        variant={t.estado === 'compensada' ? 'default' : t.estado === 'justificada' ? 'outline' : 'secondary'}
                        className="text-xs"
                      >
                        {t.estado === 'compensada' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {t.estado}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total descuentos</span>
                  <span className="font-bold text-destructive">S/ {attendanceThisMonth.descuentoTotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Last Payslip & Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Last Payslip */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Mi Última Boleta
              </CardTitle>
              <CardDescription>{lastPayslip.periodo}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sueldo Neto</span>
                  <span className="text-2xl font-bold text-green-500">S/ {lastPayslip.sueldoNeto.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Descuentos</span>
                  <span className="text-destructive">S/ {lastPayslip.descuentos}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1" onClick={() => navigate('/payroll')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Ver detalle
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Acceso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/payroll')}>
                <FileText className="w-4 h-4 mr-2" />
                Mis Boletas de Pago
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/attendance')}>
                <Clock className="w-4 h-4 mr-2" />
                Mi Asistencia
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/regulations')}>
                <FileText className="w-4 h-4 mr-2" />
                Reglamento Interno
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}