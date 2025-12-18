import { motion } from 'framer-motion';
import { Users, Clock, AlertTriangle, MessageSquare, TrendingUp, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data for team
const teamMembers = [
  { id: '1', nombre: 'Juan Pérez', puesto: 'Asesor Comercial', estado: 'tarde', horaEntrada: '09:28', descuento: 20 },
  { id: '2', nombre: 'Ana García', puesto: 'Asesor Comercial', estado: 'puntual', horaEntrada: '08:55' },
  { id: '3', nombre: 'Carlos López', puesto: 'Asesor Senior', estado: 'puntual', horaEntrada: '08:50' },
  { id: '4', nombre: 'María Torres', puesto: 'Asesor Comercial', estado: 'justificada', horaEntrada: '09:12', justificacion: 'Pendiente RRHH' },
  { id: '5', nombre: 'Luis Ramírez', puesto: 'Asesor Comercial', estado: 'ausente' },
];

const pendingJustifications = [
  { id: '1', empleado: 'Juan Pérez', fecha: '16/12/2024', motivo: 'Accidente en Av. Javier Prado', archivo: true },
];

const messages = [
  { id: '1', from: 'RRHH', subject: 'Contrato de Ana García vence 23/12', action: 'renovar' },
  { id: '2', from: 'Juan Pérez', subject: 'Solicita justificar tardanza', action: 'revisar' },
];

export function JefeDashboard() {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const teamStats = {
    total: teamMembers.length,
    presentes: teamMembers.filter(m => m.estado !== 'ausente').length,
    tardanzas: teamMembers.filter(m => m.estado === 'tarde').length,
    ausentes: teamMembers.filter(m => m.estado === 'ausente').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Mi Equipo</h1>
          <p className="text-muted-foreground mt-1">
            Área Comercial - {teamStats.total} colaboradores
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </motion.div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Equipo</p>
                  <p className="text-3xl font-bold">{teamStats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Presentes</p>
                  <p className="text-3xl font-bold text-green-500">{teamStats.presentes}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <Progress value={(teamStats.presentes / teamStats.total) * 100} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tardanzas</p>
                  <p className="text-3xl font-bold text-yellow-500">{teamStats.tardanzas}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ausentes</p>
                  <p className="text-3xl font-bold text-red-500">{teamStats.ausentes}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Attendance Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Asistencia de Hoy
              </CardTitle>
              <CardDescription>Estado de tu equipo en tiempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.nombre}</p>
                      <p className="text-sm text-muted-foreground">{member.puesto}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {member.horaEntrada && (
                      <span className="text-sm text-muted-foreground">{member.horaEntrada}</span>
                    )}
                    <Badge 
                      variant={
                        member.estado === 'puntual' ? 'default' : 
                        member.estado === 'tarde' ? 'secondary' :
                        member.estado === 'justificada' ? 'outline' : 'destructive'
                      }
                    >
                      {member.estado === 'puntual' && '✅ Puntual'}
                      {member.estado === 'tarde' && `⏰ Tarde (S/ ${member.descuento})`}
                      {member.estado === 'justificada' && '📝 Justificada'}
                      {member.estado === 'ausente' && '❌ Ausente'}
                    </Badge>
                    {(member.estado === 'tarde' || member.estado === 'ausente') && (
                      <Button size="sm" variant="ghost">
                        Justificar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Messages & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Pending Justifications */}
          {pendingJustifications.length > 0 && (
            <Card className="border-yellow-500/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Justificaciones Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingJustifications.map((j) => (
                  <div key={j.id} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <p className="font-medium">{j.empleado}</p>
                    <p className="text-sm text-muted-foreground">{j.fecha} - {j.motivo}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="default">Aprobar</Button>
                      <Button size="sm" variant="outline">Rechazar</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Messages */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Mensajes ({messages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{msg.from}</Badge>
                  </div>
                  <p className="text-sm">{msg.subject}</p>
                  <Button size="sm" variant="ghost" className="mt-2">
                    {msg.action === 'renovar' ? 'Responder' : 'Ver detalles'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/requirements')}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Crear Requerimiento
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/attendance')}>
                <Clock className="w-4 h-4 mr-2" />
                Ver Historial Equipo
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/messages')}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar Mensaje a RRHH
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}