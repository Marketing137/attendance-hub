import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CommissionCalculation, 
  AdvisorMetrics,
  COMMISSION_CONFIG,
  COMMISSION_TIERS,
  PRODUCT_COEFFICIENTS 
} from '@/types/payroll';
import { Calculator, Target, Award, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CommissionCalculatorProps {
  calculation: CommissionCalculation;
  salesRecords?: any[];
}

export function CommissionCalculator({ calculation, salesRecords }: CommissionCalculatorProps) {
  const { metrics, bonuses } = calculation;
  const prProgress = Math.min(100, (metrics.totalNeto / COMMISSION_CONFIG.profitabilityPoint) * 100);
  
  const gatesStatus = [
    { name: 'Cobertura 2h (≥95%)', passed: metrics.coverageRate >= 0.95, value: `${(metrics.coverageRate * 100).toFixed(0)}%` },
    { name: '3 intentos/72h', passed: metrics.followUpComplete, value: metrics.followUpComplete ? 'Sí' : 'No' },
    { name: 'CRM Completo', passed: metrics.crmComplete, value: metrics.crmComplete ? 'Sí' : 'No' },
    { name: 'Script & Ética', passed: metrics.scriptCompliance, value: metrics.scriptCompliance ? 'Sí' : 'No' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              <span className="text-xs">Ventas Válidas</span>
            </div>
            <p className="text-2xl font-bold">{metrics.validSales}</p>
            <p className="text-xs text-muted-foreground">de {metrics.totalSales} totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Recaudo NETO</span>
            </div>
            <p className="text-2xl font-bold">S/ {metrics.totalNeto.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">BRUTO: S/ {metrics.totalBruto.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calculator className="h-4 w-4" />
              <span className="text-xs">Recaudo Rentable (RR)</span>
            </div>
            <p className={`text-2xl font-bold ${calculation.rentableRevenue > 0 ? 'text-green-600' : 'text-destructive'}`}>
              S/ {calculation.rentableRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">PR: S/ {COMMISSION_CONFIG.profitabilityPoint.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="h-4 w-4" />
              <span className="text-xs">Pago Final</span>
            </div>
            <p className="text-2xl font-bold text-primary">S/ {calculation.finalPayment.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {calculation.gatesPenalty === 1 ? '100%' : calculation.gatesPenalty === 0.7 ? '70%' : 'Retenido'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress to PR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Progreso hacia Punto de Rentabilidad (PR)</CardTitle>
          <CardDescription>S/ {COMMISSION_CONFIG.profitabilityPoint.toFixed(2)} requerido para comenzar a comisionar</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={prProgress} className="h-3" />
          <div className="flex justify-between mt-2 text-sm">
            <span>S/ {metrics.totalNeto.toFixed(2)} recaudado</span>
            <span className={prProgress >= 100 ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
              {prProgress.toFixed(0)}% del PR
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="commission" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="commission">Comisión</TabsTrigger>
          <TabsTrigger value="bonuses">Bonos</TabsTrigger>
          <TabsTrigger value="gates">Gates</TabsTrigger>
          <TabsTrigger value="tiers">Estructura</TabsTrigger>
        </TabsList>

        <TabsContent value="commission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cálculo de Comisión Marginal</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tramo RR</TableHead>
                    <TableHead>% Comisión</TableHead>
                    <TableHead>Monto en Tramo</TableHead>
                    <TableHead className="text-right">Comisión</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>S/ 0 - 1,999</TableCell>
                    <TableCell>0%</TableCell>
                    <TableCell>S/ {Math.min(Math.max(0, calculation.rentableRevenue), 1999.99).toFixed(2)}</TableCell>
                    <TableCell className="text-right">S/ 0.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>S/ 2,000 - 4,999</TableCell>
                    <TableCell>10%</TableCell>
                    <TableCell>S/ {Math.min(Math.max(0, calculation.rentableRevenue - 2000), 3000).toFixed(2)}</TableCell>
                    <TableCell className="text-right">S/ {calculation.tier2Commission.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>S/ 5,000 - 7,999</TableCell>
                    <TableCell>15%</TableCell>
                    <TableCell>S/ {Math.min(Math.max(0, calculation.rentableRevenue - 5000), 3000).toFixed(2)}</TableCell>
                    <TableCell className="text-right">S/ {calculation.tier3Commission.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>S/ 8,000 - 12,999</TableCell>
                    <TableCell>18%</TableCell>
                    <TableCell>S/ {Math.min(Math.max(0, calculation.rentableRevenue - 8000), 5000).toFixed(2)}</TableCell>
                    <TableCell className="text-right">S/ {calculation.tier4Commission.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>≥ S/ 13,000</TableCell>
                    <TableCell>22%</TableCell>
                    <TableCell>S/ {Math.max(0, calculation.rentableRevenue - 13000).toFixed(2)}</TableCell>
                    <TableCell className="text-right">S/ {calculation.tier5Commission.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={3}>Comisión Base Total</TableCell>
                    <TableCell className="text-right">S/ {calculation.baseCommission.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              {calculation.gatesPenalty < 1 && (
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Penalización por Gates: {((1 - calculation.gatesPenalty) * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comisión ajustada: S/ {calculation.adjustedCommission.toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bonuses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bonos Aceleradores</CardTitle>
              <CardDescription>Tope mensual: S/ {COMMISSION_CONFIG.maxMonthlyBonus.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Ticket Saludable</p>
                    <p className="text-xs text-muted-foreground">BRUTO &gt; S/ 500 = S/ 100 | &gt; S/ 600 = S/ 200</p>
                  </div>
                  <Badge variant={bonuses.ticketSaludable > 0 ? 'default' : 'secondary'}>
                    S/ {bonuses.ticketSaludable.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Productividad</p>
                    <p className="text-xs text-muted-foreground">≥30 ventas = S/ 100 | ≥45 = S/ 200 (Morosidad ≤12%)</p>
                  </div>
                  <Badge variant={bonuses.productividad > 0 ? 'default' : 'secondary'}>
                    S/ {bonuses.productividad.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Seguimiento Perfecto</p>
                    <p className="text-xs text-muted-foreground">0 leads sin contactar + CRM 100%</p>
                  </div>
                  <Badge variant={bonuses.seguimientoPerfecto > 0 ? 'default' : 'secondary'}>
                    S/ {bonuses.seguimientoPerfecto.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Calidad (NPS)</p>
                    <p className="text-xs text-muted-foreground">NPS ≥ 4.4/5 = S/ 150</p>
                  </div>
                  <Badge variant={bonuses.calidadNPS > 0 ? 'default' : 'secondary'}>
                    S/ {bonuses.calidadNPS.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Retención</p>
                    <p className="text-xs text-muted-foreground">Deserción &lt; 5% = S/ 200</p>
                  </div>
                  <Badge variant={bonuses.retencion > 0 ? 'default' : 'secondary'}>
                    S/ {bonuses.retencion.toFixed(2)}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold">Total Bonos</span>
                  <span className="text-lg font-bold text-primary">S/ {bonuses.adjustedBonuses.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gates de Liberación</CardTitle>
              <CardDescription>Se requiere cumplir 4/4 gates para liberación completa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gatesStatus.map((gate, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${gate.passed ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                    <div className="flex items-center gap-3">
                      {gate.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      )}
                      <span className="font-medium">{gate.name}</span>
                    </div>
                    <Badge variant={gate.passed ? 'default' : 'destructive'}>
                      {gate.value}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 rounded-lg bg-muted">
                <h4 className="font-medium mb-2">Régimen de Gates</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>4 gates:</strong> 100% comisión + bonos (sujeto a CAP)</li>
                  <li>• <strong>3 gates:</strong> 70% comisión base, sin bonos</li>
                  <li>• <strong>≤2 gates:</strong> Comisión retenida hasta regularización</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estructura de Comisiones CCD 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Tramos de Comisión (Marginal sobre RR)</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tramo RR (S/)</TableHead>
                      <TableHead>% Comisión Marginal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {COMMISSION_TIERS.map((tier, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {tier.min.toLocaleString()} - {tier.max === Infinity ? '∞' : tier.max.toLocaleString()}
                        </TableCell>
                        <TableCell>{(tier.rate * 100).toFixed(0)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Coeficientes por Producto</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Coeficiente</TableHead>
                      <TableHead>Ejemplos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(PRODUCT_COEFFICIENTS).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{value.name}</TableCell>
                        <TableCell>× {value.coefficient.toFixed(2)}</TableCell>
                        <TableCell className="text-muted-foreground">{value.examples}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/5">
                <h4 className="font-medium mb-2">Fórmula de Cálculo</h4>
                <code className="text-sm">
                  NETO = BRUTO / 1.18<br />
                  RR = Σ(cobros NETO × coeficiente) – PR<br />
                  Comisión = suma marginal por tramos sobre RR<br />
                  Pago = MIN(CAP × RR, Comisión + Bonos) con CAP = 45%
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
