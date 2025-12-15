import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle, FileText, Clock, Heart, Calendar, User, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Employee, Sanction, InfractionLevel, SanctionType } from '@/types/attendance';
import { mockRegulations } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const sanctionFormSchema = z.object({
  infractionLevel: z.enum(['leve', 'grave', 'muy_grave'] as const, {
    required_error: 'Seleccione el nivel de falta',
  }),
  sanctionType: z.enum(['verbal_warning', 'written_warning', 'suspension', 'dismissal'] as const, {
    required_error: 'Seleccione el tipo de sanción',
  }),
  regulationArticle: z.string().min(1, 'Seleccione el artículo del reglamento'),
  incidentDate: z.string().min(1, 'Ingrese la fecha del incidente'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(500, 'Máximo 500 caracteres'),
  tardyMinutes: z.number().optional(),
  compensationDate: z.string().optional(),
  medicalDocument: z.boolean().optional(),
  notes: z.string().max(300, 'Máximo 300 caracteres').optional(),
});

type SanctionFormData = z.infer<typeof sanctionFormSchema>;

const INFRACTION_LEVELS: Record<InfractionLevel, { name: string; color: string; icon: typeof AlertTriangle; sanctions: SanctionType[] }> = {
  leve: { 
    name: 'Falta Leve', 
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    icon: AlertTriangle,
    sanctions: ['verbal_warning']
  },
  grave: { 
    name: 'Falta Grave', 
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
    icon: AlertTriangle,
    sanctions: ['written_warning', 'suspension']
  },
  muy_grave: { 
    name: 'Falta Muy Grave', 
    color: 'bg-destructive/10 text-destructive border-destructive/30',
    icon: AlertTriangle,
    sanctions: ['suspension', 'dismissal']
  },
};

const SANCTION_TYPES: Record<SanctionType, { name: string; description: string }> = {
  verbal_warning: { name: 'Amonestación Verbal', description: 'Art. 42 - Para faltas primarias y leves' },
  written_warning: { name: 'Amonestación Escrita', description: 'Art. 43 - Para faltas graves' },
  suspension: { name: 'Suspensión sin Goce', description: 'Art. 43 - Para faltas muy graves' },
  dismissal: { name: 'Despido', description: 'Art. 41 - Última instancia' },
};

const INFRACTION_EXAMPLES = {
  leve: [
    { article: 'Art. 50', description: 'Tardanzas reiteradas (más de 5 min de tolerancia)' },
    { article: 'Art. 50', description: 'Uso de celular para fines no laborales' },
    { article: 'Art. 50', description: 'No usar uniforme o credencial' },
    { article: 'Art. 50', description: 'Dejar equipos encendidos innecesariamente' },
    { article: 'Art. 22', description: 'No registrar asistencia correctamente' },
  ],
  grave: [
    { article: 'Art. 50', description: 'Disminución intencional del rendimiento' },
    { article: 'Art. 50', description: 'Dormir en horario laboral' },
    { article: 'Art. 24', description: 'Ausencia injustificada' },
    { article: 'Art. 25', description: 'Ausentarse sin permiso autorizado' },
  ],
  muy_grave: [
    { article: 'Art. 50', description: 'Alterar registros de asistencia' },
    { article: 'Art. 50', description: 'Marcar asistencia de otro colaborador' },
    { article: 'Art. 50', description: 'Faltar el respeto a superiores o compañeros' },
    { article: 'Art. 50', description: 'Incumplimiento grave de funciones' },
  ],
};

interface SanctionFormProps {
  employee: Employee;
  onSubmit: (sanction: Omit<Sanction, 'id'>) => void;
  onCancel: () => void;
}

export function SanctionForm({ employee, onSubmit, onCancel }: SanctionFormProps) {
  const [selectedLevel, setSelectedLevel] = useState<InfractionLevel | null>(null);
  const [showTardyFields, setShowTardyFields] = useState(false);
  const [showHealthFields, setShowHealthFields] = useState(false);

  const form = useForm<SanctionFormData>({
    resolver: zodResolver(sanctionFormSchema),
    defaultValues: {
      infractionLevel: undefined,
      sanctionType: undefined,
      regulationArticle: '',
      incidentDate: new Date().toISOString().split('T')[0],
      description: '',
      tardyMinutes: undefined,
      compensationDate: undefined,
      medicalDocument: false,
      notes: '',
    },
  });

  const watchedLevel = form.watch('infractionLevel');
  const watchedArticle = form.watch('regulationArticle');

  const handleLevelChange = (level: InfractionLevel) => {
    setSelectedLevel(level);
    form.setValue('infractionLevel', level);
    form.setValue('sanctionType', undefined as any);
    
    // Check if tardiness-related
    setShowTardyFields(false);
    setShowHealthFields(false);
  };

  const handleArticleChange = (article: string) => {
    form.setValue('regulationArticle', article);
    
    // Show specific fields based on article
    const isTardyRelated = article.toLowerCase().includes('tardanza') || article.includes('Art. 22');
    const isHealthRelated = article.toLowerCase().includes('salud') || article.toLowerCase().includes('ausencia');
    
    setShowTardyFields(isTardyRelated);
    setShowHealthFields(isHealthRelated);
  };

  const handleSubmit = (data: SanctionFormData) => {
    const newSanction: Omit<Sanction, 'id'> = {
      employeeId: employee.id,
      type: data.sanctionType,
      infractionLevel: data.infractionLevel,
      description: data.description,
      regulationArticle: data.regulationArticle,
      date: data.incidentDate,
      appliedBy: 'RRHH',
      status: 'active',
      notes: data.notes,
    };

    onSubmit(newSanction);
    toast({
      title: 'Sanción registrada',
      description: `Se ha aplicado ${SANCTION_TYPES[data.sanctionType].name} a ${employee.name}`,
    });
  };

  const relevantArticles = mockRegulations.filter(r => r.category === 'faltas_sanciones');

  return (
    <div className="space-y-6">
      {/* Header with Employee Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">
                {employee.position} • {employee.department.charAt(0).toUpperCase() + employee.department.slice(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
              <Clock className="h-4 w-4" />
              Tardanzas y Compensaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Tolerancia máxima: <strong>5 minutos</strong></p>
            <p>• Compensación: mismo día o día siguiente</p>
            <p>• Máximo <strong>1 vez por semana</strong></p>
            <p>• Coordinar con jefe inmediato</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-600">
              <Heart className="h-4 w-4" />
              Faltas por Salud
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Presentar descanso médico <strong>físicamente</strong></p>
            <p>• Validación obligatoria por RRHH</p>
            <p>• Requisito para justificar la falta</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Step 1: Infraction Level */}
          <div className="space-y-3">
            <FormLabel className="text-base font-semibold flex items-center gap-2">
              <Scale className="h-4 w-4" />
              1. Nivel de Falta (Art. 50)
            </FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.entries(INFRACTION_LEVELS) as [InfractionLevel, typeof INFRACTION_LEVELS.leve][]).map(([level, config]) => (
                <Card 
                  key={level}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    watchedLevel === level ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleLevelChange(level)}
                >
                  <CardContent className="pt-4">
                    <Badge className={config.color}>{config.name}</Badge>
                    <ul className="mt-3 text-xs text-muted-foreground space-y-1">
                      {INFRACTION_EXAMPLES[level].slice(0, 3).map((ex, i) => (
                        <li key={i}>• {ex.description}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-primary">
                      Sanciones: {config.sanctions.map(s => SANCTION_TYPES[s].name).join(', ')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {form.formState.errors.infractionLevel && (
              <p className="text-sm text-destructive">{form.formState.errors.infractionLevel.message}</p>
            )}
          </div>

          {/* Step 2: Sanction Type */}
          {selectedLevel && (
            <FormField
              control={form.control}
              name="sanctionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    2. Tipo de Sanción
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Seleccione la sanción a aplicar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      {INFRACTION_LEVELS[selectedLevel].sanctions.map((sanctionType) => (
                        <SelectItem key={sanctionType} value={sanctionType}>
                          <div>
                            <span className="font-medium">{SANCTION_TYPES[sanctionType].name}</span>
                            <span className="text-muted-foreground ml-2 text-xs">
                              - {SANCTION_TYPES[sanctionType].description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Step 3: Regulation Article */}
          <FormField
            control={form.control}
            name="regulationArticle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  3. Artículo del Reglamento
                </FormLabel>
                <Select onValueChange={(v) => { field.onChange(v); handleArticleChange(v); }} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Seleccione el artículo aplicable" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                    {relevantArticles.map((article) => (
                      <SelectItem key={article.number} value={`${article.number} - ${article.title}`}>
                        <span className="font-medium">{article.number}</span>
                        <span className="text-muted-foreground ml-2">- {article.title}</span>
                      </SelectItem>
                    ))}
                    {selectedLevel && INFRACTION_EXAMPLES[selectedLevel].map((ex, i) => (
                      <SelectItem key={`custom-${i}`} value={`${ex.article} - ${ex.description}`}>
                        <span className="font-medium">{ex.article}</span>
                        <span className="text-muted-foreground ml-2">- {ex.description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Step 4: Incident Date */}
          <FormField
            control={form.control}
            name="incidentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  4. Fecha del Incidente
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditional: Tardiness Fields */}
          {showTardyFields && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Detalles de Tardanza</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tardyMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minutos de tardanza</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ej: 15" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormDescription>Tiempo de tardanza sobre los 5 min de tolerancia</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="compensationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de compensación (si aplica)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-background" />
                      </FormControl>
                      <FormDescription>Solo 1 vez por semana, coordinar con jefe</FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Conditional: Health Fields */}
          {showHealthFields && (
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Documentación de Salud</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="medicalDocument"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <input 
                          type="checkbox" 
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-border"
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="text-sm">¿Se presentó descanso médico físico?</FormLabel>
                        <FormDescription>Requisito obligatorio para justificar la falta</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 5: Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">5. Descripción del Incidente</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describa detalladamente lo ocurrido, incluyendo fecha, hora y circunstancias..." 
                    {...field}
                    rows={4}
                    className="bg-background resize-none"
                  />
                </FormControl>
                <FormDescription>{field.value?.length || 0}/500 caracteres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Step 6: Additional Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Observaciones adicionales, compromisos del colaborador, etc." 
                    {...field}
                    rows={2}
                    className="bg-background resize-none"
                  />
                </FormControl>
                <FormDescription>{field.value?.length || 0}/300 caracteres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-destructive hover:bg-destructive/90">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Registrar Sanción
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
