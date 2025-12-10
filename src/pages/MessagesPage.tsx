import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { MessageCenter } from '@/components/messages/MessageCenter';
import { mockMessages } from '@/data/mockData';

const MessagesPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold gradient-text">Centro de Mensajes</h1>
          <p className="text-muted-foreground mt-1">
            Comunícate con los jefes de área para validar asistencia
          </p>
        </motion.div>

        {/* Message Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MessageCenter messages={mockMessages} />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default MessagesPage;
