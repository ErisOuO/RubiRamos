'use client';

import Link from 'next/link';
import NavLinks from '@/components/dashboard/nav-links';
import Image from 'next/image';
import { ArrowLeftEndOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

export default function SideNav({
  mobile = false,
  onClose,
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
  const handleClick = () => {
    if (onClose) onClose();
  };

  // Orden específico según tu requerimiento:
  // 1. Logo (solo en desktop)
  // 2. Navegación principal y configuración
  // 3. Cerrar sesión
  // 4. Perfil

  return (
    <div className={`flex flex-col ${mobile ? 'h-auto' : 'h-full'}`}>
      {/* Logo - solo en desktop */}
      {!mobile && (
        <div className="flex h-24 items-center justify-center p-4 border-b" style={{ borderColor: '#5A8C7A' }}>
          <div className="relative w-44 h-14">
            <Image
              src="/logo_rubi.png"
              fill
              alt="RubiRamos Logo"
              priority
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Contenido de navegación - crece para ocupar espacio disponible */}
      <div className="flex-grow px-3 py-4">
        <NavLinks mobile={mobile} onLinkClick={handleClick} />
      </div>

      {/* Botón cerrar sesión */}
      <div className="px-3 py-3 border-t" style={{ borderColor: mobile ? '#5A8C7A' : '#5A8C7A' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors w-full ${
            mobile 
              ? 'hover:bg-red-600/20 justify-center' 
              : 'hover:bg-red-600/20 justify-start'
          }`}
          style={{ color: mobile ? '#FFFFFF' : '#FFFFFF' }}
        >
          <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Perfil - al final */}
      <div className="px-3 py-4 border-t" style={{ borderColor: mobile ? '#5A8C7A' : '#5A8C7A' }}>
        <div className="flex items-center gap-3 p-3 rounded-lg" 
          style={{ 
            backgroundColor: mobile ? 'rgba(90, 140, 122, 0.2)' : '#5A8C7A' 
          }}
        >
          <div className="h-10 w-10 rounded-full flex items-center justify-center" 
            style={{ 
              backgroundColor: mobile ? '#5A8C7A' : 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <UserCircleIcon className="h-6 w-6" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Lic. Rubí Ramos</p>
            <p className="text-xs" style={{ color: mobile ? '#A8CF45' : '#A8CF45' }}>Nutrióloga</p>
          </div>
        </div>
      </div>
    </div>
  );
}