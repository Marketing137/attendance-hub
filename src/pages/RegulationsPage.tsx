import { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Search, FileText, Clock, AlertTriangle, Users, Shield, Calendar, Briefcase } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mockRegulations } from '@/data/mockData';

const categories = [
  { id: 'all', name: 'Todos', icon: Book },
  { id: 'jornada', name: 'Jornada Laboral', icon: Clock },
  { id: 'ausencias', name: 'Ausencias y Permisos', icon: Calendar },
  { id: 'faltas_sanciones', name: 'Faltas y Sanciones', icon: AlertTriangle },
  { id: 'admision', name: 'Admisión', icon: Users },
  { id: 'descansos', name: 'Descansos', icon: Shield },
];

const infractionsData = {
  leves: [
    'Llegar tarde o salir antes de la hora establecida sin autorización',
    'No incorporarse a labores inmediatamente tras registrar ingreso',
    'Uso de celulares para fines no laborables durante jornada',
    'No usar uniforme asignado en días y fechas fijadas',
    'Dejar equipos de cómputo y/o eléctricos encendidos',
    'No realizar la marcación correspondiente en horario de ingreso/salida',
    'Ingerir alimentos sólidos en horario laboral',
    'Demora en los servicios higiénicos',
  ],
  graves: [
    'Disminución intencional del ritmo de trabajo',
    'Incumplimiento de actividades asignadas',
    'No presentar documentación solicitada en fecha fijada',
    'Dirigirse de manera desafiante a jefe inmediato/superior',
    'Dormir en horario laboral',
    'Efectuar actividades de carácter mercantil en centro de trabajo',
    'Perjudicar el ambiente laboral con comentarios',
  ],
  muy_graves: [
    'Alterar los registros de control de asistencia',
    'Marcar asistencia de otro colaborador o permitir que otro marque la suya',
    'Presentarse a labores en estado de embriaguez o bajo efectos de narcóticos',
    'Faltar al respeto a compañero, superior jerárquico o cliente',
    'Proporcionar información falsa en forma intencional',
    'Falsificar descansos médicos u otros documentos',
    'Faltar al trabajo sin causa debidamente justificada',
    'Acosar sexualmente en el entorno laboral',
  ],
};

const sanctionsData = [
  { type: 'Amonestación Verbal', description: 'Se aplica cuando la falta es primaria, leve y no reviste gravedad. A cargo de RRHH o jefe inmediato.', level: 'Faltas Leves' },
  { type: 'Amonestación Escrita', description: 'Se aplica en casos de faltas graves o reincidencia de faltas leves.', level: 'Faltas Graves' },
  { type: 'Suspensión sin Goce', description: 'Se aplica cuando la falta es muy grave pero no amerita despido, o por reincidencia de faltas graves.', level: 'Faltas Muy Graves' },
  { type: 'Despido', description: 'Debe producirse por causa justa contemplada en la Ley y debidamente comprobada.', level: 'Faltas Gravísimas' },
];

const RegulationsPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredRegulations = mockRegulations.filter(reg => {
    const matchesSearch = 
      reg.title.toLowerCase().includes(search.toLowerCase()) ||
      reg.content.toLowerCase().includes(search.toLowerCase()) ||
      reg.number.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || reg.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold gradient-text">Reglamento Interno</h1>
          <p className="text-muted-foreground mt-1">
            Centro de Capacitación y Desarrollo S.A.C. - Normativa Laboral
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jornada Semanal</p>
                    <p className="text-2xl font-bold">48h</p>
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
                    <Calendar className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vacaciones</p>
                    <p className="text-2xl font-bold">15 días</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Período de Prueba</p>
                    <p className="text-2xl font-bold">3 meses</p>
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
                    <FileText className="w-6 h-6 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Refrigerio</p>
                    <p className="text-2xl font-bold">60 min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="glass-card p-1">
            <TabsTrigger value="articles">Artículos</TabsTrigger>
            <TabsTrigger value="infractions">Infracciones</TabsTrigger>
            <TabsTrigger value="sanctions">Sanciones</TabsTrigger>
            <TabsTrigger value="schedule">Horarios</TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-4"
            >
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar en el reglamento..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'outline'}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <cat.icon className="w-3 h-3 mr-1" />
                  {cat.name}
                </Badge>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <Accordion type="multiple" className="space-y-2">
                    {filteredRegulations.map((reg) => (
                      <AccordionItem key={reg.number} value={reg.number} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <Badge variant="secondary" className="font-mono">{reg.number}</Badge>
                            <span className="font-medium">{reg.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed pl-16">
                            {reg.content}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Infractions Tab */}
          <TabsContent value="infractions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass-card border-warning/30 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <CardTitle className="text-warning">Faltas Leves</CardTitle>
                        <CardDescription>Amonestación verbal</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {infractionsData.leves.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="glass-card border-orange-500/30 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <CardTitle className="text-orange-500">Faltas Graves</CardTitle>
                        <CardDescription>Amonestación escrita</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {infractionsData.graves.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="glass-card border-destructive/30 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <CardTitle className="text-destructive">Faltas Muy Graves</CardTitle>
                        <CardDescription>Suspensión o despido</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {infractionsData.muy_graves.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Sanctions Tab */}
          <TabsContent value="sanctions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sanctionsData.map((sanction, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                >
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{sanction.type}</CardTitle>
                        <Badge variant="outline">{sanction.level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{sanction.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Criterios de Graduación (Art. 40)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    'Naturaleza y gravedad de la falta',
                    'Antecedentes del colaborador',
                    'Reincidencia en la falta',
                    'Circunstancias en que se cometió',
                    'Responsabilidad dolosa o culposa',
                    'Posición jerárquica del colaborador',
                  ].map((criterio, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm">{criterio}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Horario de Trabajo (Art. 19)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold mb-2">Lunes a Viernes</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Mañana</p>
                          <p className="font-medium">09:00 - 13:00</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tarde</p>
                          <p className="font-medium">14:00 - 18:00</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h4 className="font-semibold mb-2">Sábado</h4>
                      <p className="text-sm">09:00 - 13:00 (4 horas - Remoto/Presencial)</p>
                    </div>
                    <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                      <h4 className="font-semibold mb-2">Refrigerio (Art. 20)</h4>
                      <p className="text-sm">13:00 - 14:00 (60 minutos)</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-success" />
                      Licencias con Goce (Art. 28)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { type: 'Enfermedad o accidente', days: 'Según certificado' },
                      { type: 'Maternidad', days: 'Según Ley' },
                      { type: 'Fallecimiento familiar (local)', days: '3 días' },
                      { type: 'Fallecimiento familiar (provincia)', days: '6 días' },
                      { type: 'Capacitación auspiciada', days: 'Duración del evento' },
                      { type: 'Citación judicial/policial', days: 'Según requerimiento' },
                    ].map((license, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <span className="text-sm">{license.type}</span>
                        <Badge variant="outline">{license.days}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-info" />
                  Permisos y Ausencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2">Permiso (Art. 25)</h4>
                    <p className="text-sm text-muted-foreground">
                      Autorización escrita para ausentarse momentáneamente o por un día. 
                      Requiere aviso de 48 horas y se compensa con horas extra.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2">Licencia (Art. 26)</h4>
                    <p className="text-sm text-muted-foreground">
                      Autorización para dejar de asistir por más de un día, con o sin pago de remuneraciones.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2">Ausencia (Art. 24)</h4>
                    <p className="text-sm text-muted-foreground">
                      Incumplimiento de prestación personal. Releva a la empresa de abonar remuneración, salvo excepciones legales.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default RegulationsPage;