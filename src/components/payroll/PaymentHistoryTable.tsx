import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaymentHistory } from '@/types/payroll';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Download, Eye } from 'lucide-react';

interface PaymentHistoryTableProps {
  history: PaymentHistory[];
  onViewPayslip?: (payslipId: string) => void;
  onDownload?: (history: PaymentHistory) => void;
}

export function PaymentHistoryTable({ history, onViewPayslip, onDownload }: PaymentHistoryTableProps) {
  const methodLabels = {
    transfer: 'Transferencia',
    cash: 'Efectivo',
    check: 'Cheque',
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Período</TableHead>
          <TableHead>Fecha de Pago</TableHead>
          <TableHead>Monto Neto</TableHead>
          <TableHead>Método</TableHead>
          <TableHead>Referencia</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              No hay historial de pagos
            </TableCell>
          </TableRow>
        ) : (
          history.map(record => {
            const monthDate = new Date(record.month + '-01');
            return (
              <TableRow key={record.id}>
                <TableCell className="font-medium capitalize">
                  {format(monthDate, 'MMMM yyyy', { locale: es })}
                </TableCell>
                <TableCell>
                  {format(new Date(record.paidAt), "d 'de' MMMM, yyyy", { locale: es })}
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  S/ {record.netPay.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{methodLabels[record.paymentMethod]}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {record.reference || '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewPayslip?.(record.payslipId)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDownload?.(record)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
