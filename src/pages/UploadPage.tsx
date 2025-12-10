import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Info, CheckCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FileUploadZone } from '@/components/upload/FileUploadZone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UploadPage = () => {
  const [uploadedData, setUploadedData] = useState<any[] | null>(null);

  const handleUploadComplete = (data: any[]) => {
    setUploadedData(data);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold gradient-text">Cargar Reporte</h1>
          <p className="text-muted-foreground mt-1">
            Sube el archivo de asistencia del huellero
          </p>
        </motion.div>

        {/* Info Alert */}
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle>Formato de archivo</AlertTitle>
          <AlertDescription>
            El sistema acepta archivos .xls y .xlsx exportados del huellero. 
            Asegúrate de que el archivo contenga el reporte de turnos y estadísticas de asistencia.
          </AlertDescription>
        </Alert>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Subir Archivo
              </CardTitle>
              <CardDescription>
                Arrastra el reporte de asistencia o haz clic para seleccionar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadZone onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">1. Exportar del Huellero</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Desde el sistema de huellero, exporta el reporte en formato Excel (.xls o .xlsx)
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5 text-accent" />
              </div>
              <CardTitle className="text-lg">2. Cargar Archivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Arrastra el archivo al área de carga o haz clic para seleccionarlo
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <CardTitle className="text-lg">3. Validar y Procesar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                El sistema procesará automáticamente la información y actualizará los registros
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Success message if data uploaded */}
        {uploadedData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert className="bg-success/5 border-success/20">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertTitle>Archivo procesado correctamente</AlertTitle>
              <AlertDescription>
                Se han cargado {uploadedData.length - 9} registros de asistencia. 
                Los datos están disponibles en la sección de Asistencia.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default UploadPage;
