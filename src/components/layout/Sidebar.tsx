import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Upload, 
  MessageSquare, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
  FileCheck,
  UserPlus,
  Book,
  Wallet,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MenuItem {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
  roles?: AppRole[]; // If undefined, all roles can see it
}

const allMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Upload, label: 'Cargar Reporte', path: '/upload', roles: ['admin_rrhh'] },
  { icon: Users, label: 'Empleados', path: '/employees', roles: ['admin_rrhh', 'jefe_area'] },
  { icon: Clock, label: 'Asistencia', path: '/attendance' },
  { icon: Building2, label: 'Departamentos', path: '/departments', roles: ['admin_rrhh', 'jefe_area'] },
  { icon: FileCheck, label: 'Contratos', path: '/contracts', roles: ['admin_rrhh', 'jefe_area'] },
  { icon: Wallet, label: 'Boletas de Pago', path: '/payroll' },
  { icon: UserPlus, label: 'Requerimientos', path: '/requirements', roles: ['admin_rrhh', 'jefe_area'] },
  { icon: MessageSquare, label: 'Mensajes', path: '/messages' },
  { icon: BarChart3, label: 'Reportes', path: '/reports', roles: ['admin_rrhh'] },
  { icon: Book, label: 'Reglamento', path: '/regulations' },
  { icon: Settings, label: 'Configuración', path: '/settings', roles: ['admin_rrhh'] },
];

const roleLabels: Record<AppRole, { label: string; color: string }> = {
  admin_rrhh: { label: 'Admin RRHH', color: 'bg-destructive text-destructive-foreground' },
  jefe_area: { label: 'Jefe de Área', color: 'bg-warning text-warning-foreground' },
  empleado: { label: 'Empleado', color: 'bg-primary text-primary-foreground' },
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, userRole, signOut } = useAuth();

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) => {
    if (!item.roles) return true; // No role restriction
    if (!userRole) return false; // No role assigned
    return item.roles.includes(userRole.role);
  });

  const roleInfo = userRole ? roleLabels[userRole.role] : null;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-sidebar z-50 flex flex-col border-r border-sidebar-border"
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Clock className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-sidebar-foreground text-lg">RRHH CCD</h1>
                <p className="text-xs text-sidebar-foreground/60">Sistema de Gestión</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mx-auto">
            <Clock className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* User Info */}
      {user && !isCollapsed && (
        <div className="px-3 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.email?.split('@')[0] || 'Usuario'}
              </p>
              {roleInfo && (
                <Badge className={cn('text-xs mt-1', roleInfo.color)}>
                  {roleInfo.label}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )
            }
          >
            <item.icon className={cn('w-5 h-5 flex-shrink-0', isCollapsed && 'mx-auto')} />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {/* Logout Button */}
        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-center text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-2">Cerrar sesión</span>}
          </Button>
        )}
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span>Colapsar</span>
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}