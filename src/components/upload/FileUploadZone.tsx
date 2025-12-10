import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface UploadedFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  recordCount?: number;
}

interface FileUploadZoneProps {
  onUploadComplete?: (data: any[]) => void;
}

export function FileUploadZone({ onUploadComplete }: FileUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const processExcelFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsBinaryString(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      status: 'pending',
      progress: 0,
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);

    for (let i = 0; i < newFiles.length; i++) {
      const fileIndex = uploadedFiles.length + i;
      
      setUploadedFiles(prev => 
        prev.map((f, idx) => idx === fileIndex ? { ...f, status: 'uploading' } : f)
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadedFiles(prev =>
          prev.map((f, idx) => idx === fileIndex ? { ...f, progress } : f)
        );
      }

      try {
        const data = await processExcelFile(newFiles[i].file);
        setUploadedFiles(prev =>
          prev.map((f, idx) => idx === fileIndex ? { 
            ...f, 
            status: 'success', 
            progress: 100,
            recordCount: data.length - 9 // Subtract header rows
          } : f)
        );
        toast.success(`Archivo procesado: ${data.length - 9} registros encontrados`);
        onUploadComplete?.(data);
      } catch (error) {
        setUploadedFiles(prev =>
          prev.map((f, idx) => idx === fileIndex ? { ...f, status: 'error', progress: 0 } : f)
        );
        toast.error('Error al procesar el archivo');
      }
    }
  }, [uploadedFiles.length, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
        )}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ scale: isDragActive ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
            isDragActive ? 'bg-primary/20' : 'bg-secondary'
          )}>
            <Upload className={cn(
              'w-8 h-8 transition-colors',
              isDragActive ? 'text-primary' : 'text-muted-foreground'
            )} />
          </div>
          <div>
            <p className="text-lg font-medium">
              {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra el reporte de asistencia'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              o haz clic para seleccionar un archivo .xls o .xlsx
            </p>
          </div>
        </motion.div>
      </div>

      {/* Uploaded files list */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="font-medium">Archivos cargados</h4>
            {uploadedFiles.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
              >
                <FileSpreadsheet className="w-8 h-8 text-success" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(item.file.size / 1024).toFixed(1)} KB
                    {item.recordCount && ` • ${item.recordCount} registros`}
                  </p>
                  {item.status === 'uploading' && (
                    <Progress value={item.progress} className="h-1 mt-2" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  )}
                  {item.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                  {item.status === 'error' && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
