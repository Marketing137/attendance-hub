import { motion } from 'framer-motion';
import { UploadedReport } from '@/types/attendance';
import { FileSpreadsheet, Check, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RecentUploadsProps {
  reports: UploadedReport[];
}

const statusIcons = {
  completed: Check,
  processing: Loader2,
  error: AlertCircle,
};

const statusStyles = {
  completed: 'text-success bg-success/10',
  processing: 'text-primary bg-primary/10 animate-spin',
  error: 'text-destructive bg-destructive/10',
};

export function RecentUploads({ reports }: RecentUploadsProps) {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Reportes Recientes</h3>
      <div className="space-y-3">
        {reports.map((report, index) => {
          const StatusIcon = statusIcons[report.status];
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{report.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(report.periodStart), "d MMM", { locale: es })} - {format(new Date(report.periodEnd), "d MMM yyyy", { locale: es })}
                </p>
              </div>
              <div className="text-right">
                <div className={cn('p-1.5 rounded-full', statusStyles[report.status])}>
                  <StatusIcon className="w-4 h-4" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{report.recordCount} registros</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
