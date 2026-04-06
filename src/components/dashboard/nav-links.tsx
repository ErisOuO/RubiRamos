'use client';

import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Enlaces principales - ORDEN ESPECÍFICO
const mainLinks = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Pacientes', href: '/admin/pacientes', icon: UserGroupIcon },
  { name: 'Citas', href: '/admin/calendar', icon: CalendarIcon },
  //{ name: 'Expedientes', href: '/admin/expedientes', icon: DocumentTextIcon },
  { name: 'Productos', href: '/admin/productos', icon: ShoppingBagIcon },
  //{ name: 'Reportes', href: '/admin/reportes', icon: ChartBarIcon },
];

// Enlaces de configuración
const configLinks = [
  //{ name: 'Notificaciones', href: '/admin/notificaciones', icon: BellIcon },
  //{ name: 'Configuración', href: '/admin/configuracion', icon: Cog6ToothIcon },
  { name: 'Monitoreo', href: '/admin/monitoreo', icon: ChartBarIcon }
];

export default function NavLinks({ mobile = false, onLinkClick }: { mobile?: boolean, onLinkClick?: () => void }) {
  const pathname = usePathname();

  // Función para renderizar enlaces
  const renderLinks = (links: typeof mainLinks, sectionTitle?: string) => (
    <>
      {sectionTitle && !mobile && (
        <div className="px-1 pt-4 pb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#A8CF45' }}>
            {sectionTitle}
          </h3>
        </div>
      )}
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href || 
                        (link.href !== '/admin' && pathname.startsWith(link.href));

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onLinkClick}
            className={clsx(
              'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 relative mb-1',
              isActive && 'font-semibold'
            )}
            style={
              mobile
                ? isActive
                  ? { 
                      backgroundColor: '#5A8C7A',
                      color: '#FFFFFF'
                    }
                  : { 
                      color: '#E6E3DE'
                    }
                : isActive
                ? { 
                    backgroundColor: '#5A8C7A',
                    color: '#FFFFFF'
                  }
                : { 
                    color: '#E6E3DE'
                  }
            }
          >
            {/* Indicador de activo en desktop */}
            {isActive && !mobile && (
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-6 w-1 rounded-r"
                style={{ backgroundColor: '#F58634' }}
              ></div>
            )}
            
            {/* Icono */}
            <LinkIcon className="h-4 w-4" />
            <span>{link.name}</span>
            
            {/* NOTA: He quitado el badge del número 3 en Citas según tu requerimiento */}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="flex flex-col">
      {/* Enlaces principales */}
      {renderLinks(mainLinks, mobile ? undefined : 'Principal')}
      
      {/* Separador para configuración */}
      <div className={`${mobile ? 'my-2' : 'my-4'}`}>
        <div style={{ 
          height: '1px', 
          backgroundColor: mobile ? '#5A8C7A' : '#5A8C7A',
          opacity: 0.3 
        }}></div>
      </div>
      
      {/* Enlaces de configuración - MISMO COLOR DE LETRA */}
      {renderLinks(configLinks, mobile ? undefined : 'Configuración')}
    </nav>
  );
}