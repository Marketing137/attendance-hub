import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Check, 
  CheckCheck,
  Reply,
  Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AttendanceMessage, DEPARTMENTS } from '@/types/attendance';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MessageCenterProps {
  messages: AttendanceMessage[];
  onSendMessage?: (message: Partial<AttendanceMessage>) => void;
  onReply?: (messageId: string, reply: string) => void;
}

export function MessageCenter({ messages, onSendMessage, onReply }: MessageCenterProps) {
  const [selectedMessage, setSelectedMessage] = useState<AttendanceMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    department: '',
    subject: '',
    message: '',
  });

  const getInitials = (name: string) => {
    return name.split(' ').slice(-1)[0].slice(0, 2).toUpperCase();
  };

  const handleSendMessage = () => {
    if (!newMessage.department || !newMessage.subject || !newMessage.message) {
      toast.error('Completa todos los campos');
      return;
    }
    
    toast.success('Mensaje enviado correctamente');
    setNewMessageOpen(false);
    setNewMessage({ department: '', subject: '', message: '' });
  };

  const handleReply = () => {
    if (!replyText.trim()) {
      toast.error('Escribe una respuesta');
      return;
    }
    
    toast.success('Respuesta enviada');
    setReplyText('');
    setSelectedMessage(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Messages List */}
      <div className="lg:col-span-1 glass-card rounded-xl p-4 max-h-[600px] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Mensajes</h3>
          <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Nuevo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Mensaje</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Select 
                    value={newMessage.department}
                    onValueChange={(value) => setNewMessage(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                        <SelectItem key={key} value={key}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Asunto</Label>
                  <Input 
                    placeholder="Asunto del mensaje..."
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mensaje</Label>
                  <Textarea 
                    placeholder="Escribe tu mensaje..."
                    value={newMessage.message}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewMessageOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendMessage} className="gap-2">
                  <Send className="w-4 h-4" />
                  Enviar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-2">
          {messages.map((msg, index) => {
            const dept = DEPARTMENTS[msg.department];
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedMessage(msg)}
                className={cn(
                  'p-3 rounded-lg cursor-pointer transition-all',
                  selectedMessage?.id === msg.id 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-secondary/50 hover:bg-secondary'
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(msg.fromUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{msg.fromUserName}</span>
                      {!msg.readAt && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{msg.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${dept.color}20`,
                          color: dept.color 
                        }}
                      >
                        {dept.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(msg.createdAt), "d MMM", { locale: es })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2 glass-card rounded-xl p-6">
        {selectedMessage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(selectedMessage.fromUserName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedMessage.subject}</h3>
                  <p className="text-sm text-muted-foreground">
                    De: {selectedMessage.fromUserName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedMessage.createdAt), "d 'de' MMMM yyyy, HH:mm", { locale: es })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedMessage.readAt ? (
                  <CheckCheck className="w-5 h-5 text-primary" />
                ) : (
                  <Check className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            {selectedMessage.attachmentUrl && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-border">
                <Paperclip className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Archivo adjunto</span>
                <Button variant="link" size="sm" className="ml-auto">
                  Descargar
                </Button>
              </div>
            )}

            <div className="border-t pt-4">
              <Label className="mb-2 block">Responder</Label>
              <div className="space-y-3">
                <Textarea 
                  placeholder="Escribe tu respuesta..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Paperclip className="w-4 h-4" />
                    Adjuntar
                  </Button>
                  <Button size="sm" className="gap-2" onClick={handleReply}>
                    <Reply className="w-4 h-4" />
                    Responder
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p>Selecciona un mensaje para ver los detalles</p>
          </div>
        )}
      </div>
    </div>
  );
}
