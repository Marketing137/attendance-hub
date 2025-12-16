import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Payslip } from '@/types/payroll';
import { DEPARTMENTS } from '@/types/attendance';
import { FileText, Mail, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PayslipCardProps {
  payslip: Payslip;
  onSendEmail?: (payslip: Payslip) => void;
  onPrint?: (payslip: Payslip) => void;
  onDownload?: (payslip: Payslip) => void;
  showActions?: boolean;
}

export function PayslipCard({ payslip, onSendEmail, onPrint, onDownload, showActions = true }: PayslipCardProps) {
  const statusColors = {
    draft: 'bg-muted text-muted-foreground',
    approved: 'bg-primary/10 text-primary',
    sent: 'bg-green-500/10 text-green-600',
  };

  const monthDate = new Date(payslip.month + '-01');
  const formattedMonth = format(monthDate, 'MMMM yyyy', { locale: es });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{payslip.employeeName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {payslip.position} • {DEPARTMENTS[payslip.department].name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusColors[payslip.status]}>
              {payslip.status === 'draft' ? 'Borrador' : payslip.status === 'approved' ? 'Aprobada' : 'Enviada'}
            </Badge>
            <span className="text-sm font-medium capitalize">{formattedMonth}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Earnings Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Ingresos</h4>
          <div className="grid gap-1">
            <div className="flex justify-between text-sm">
              <span>Sueldo Base ({payslip.workedDays}/{payslip.workDays} días)</span>
              <span className="font-medium">S/ {payslip.baseSalary.toFixed(2)}</span>
            </div>
            {payslip.bonuses.map(bonus => (
              <div key={bonus.id} className="flex justify-between text-sm">
                <span>{bonus.name}</span>
                <span className="font-medium">S/ {bonus.amount.toFixed(2)}</span>
              </div>
            ))}
            {payslip.overtime > 0 && (
              <div className="flex justify-between text-sm">
                <span>Horas Extra</span>
                <span className="font-medium">S/ {payslip.overtime.toFixed(2)}</span>
              </div>
            )}
            {payslip.commissions && payslip.commissions.finalPayment > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Comisiones</span>
                <span className="font-medium">S/ {payslip.commissions.finalPayment.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between pt-1 border-t border-border/50">
            <span className="font-medium">Total Ingresos</span>
            <span className="font-bold text-green-600">S/ {payslip.totalEarnings.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Deductions Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Descuentos</h4>
          <div className="grid gap-1">
            {payslip.deductions.map(deduction => (
              <div key={deduction.id} className="flex justify-between text-sm">
                <span>{deduction.name}</span>
                <span className="font-medium text-destructive">-S/ {deduction.amount.toFixed(2)}</span>
              </div>
            ))}
            {payslip.tardyDiscounts > 0 && (
              <div className="flex justify-between text-sm">
                <span>Descuento por Tardanzas</span>
                <span className="font-medium text-destructive">-S/ {payslip.tardyDiscounts.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between pt-1 border-t border-border/50">
            <span className="font-medium">Total Descuentos</span>
            <span className="font-bold text-destructive">-S/ {payslip.totalDeductions.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Net Pay */}
        <div className="flex justify-between items-center bg-primary/5 rounded-lg p-3">
          <span className="text-lg font-semibold">Sueldo Neto</span>
          <span className="text-2xl font-bold text-primary">S/ {payslip.netPay.toFixed(2)}</span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onDownload?.(payslip)}
            >
              <Download className="h-4 w-4 mr-1" />
              Descargar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onPrint?.(payslip)}
            >
              <Printer className="h-4 w-4 mr-1" />
              Imprimir
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onSendEmail?.(payslip)}
              disabled={payslip.status === 'sent'}
            >
              <Mail className="h-4 w-4 mr-1" />
              {payslip.status === 'sent' ? 'Enviada' : 'Enviar'}
            </Button>
          </div>
        )}

        {/* Sent info */}
        {payslip.sentAt && payslip.sentToEmail && (
          <p className="text-xs text-muted-foreground text-center">
            Enviada a {payslip.sentToEmail} el {format(new Date(payslip.sentAt), "d 'de' MMMM, HH:mm", { locale: es })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
