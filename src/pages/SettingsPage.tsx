import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Database, Users } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const SettingsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold gradient-text">Configuración</h1>
          <p className="text-muted-foreground mt-1">
            Administra las preferencias del sistema
          </p>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>Configura las alertas del sistema</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alerta de faltas</Label>
                  <p className="text-sm text-muted-foreground">Notificar cuando un empleado tenga una falta</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alerta de tardanzas</Label>
                  <p className="text-sm text-muted-foreground">Notificar tardanzas mayores a 15 minutos</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Resumen diario</Label>
                  <p className="text-sm text-muted-foreground">Enviar resumen de asistencia al final del día</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Work Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Horario Laboral</CardTitle>
                  <CardDescription>Define los horarios de trabajo estándar</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hora de entrada</Label>
                  <Input type="time" defaultValue="09:00" />
                </div>
                <div className="space-y-2">
                  <Label>Hora de salida</Label>
                  <Input type="time" defaultValue="18:00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tolerancia de tardanza (minutos)</Label>
                <Input type="number" defaultValue="10" />
              </div>
              <Button className="w-full">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Access Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <CardTitle>Control de Acceso</CardTitle>
                  <CardDescription>Gestiona permisos de usuarios</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Jefes de Área</p>
                      <p className="text-sm text-muted-foreground">6 usuarios</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Gestionar</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Administradores RRHH</p>
                      <p className="text-sm text-muted-foreground">2 usuarios</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Gestionar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
