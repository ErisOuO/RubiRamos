'use client';

import Link from 'next/link';
import NavLinks from '@/components/dashboard/nav-links';
import Image from 'next/image';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
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

  return (
    <div className={mobile ? 'p-3 space-y-4' : 'flex h-full flex-col border-r border-gray-200 bg-[#1e343b] text-white'}>
      {!mobile && (
        <Link className="flex h-24 items-center justify-center p-4 md:h-32" href="/">
          <div className="relative w-40 md:w-48 h-12">
            <Image
              src="/logo_rubi.png"
              fill
              alt="RubiRamos Logo"
              priority
              className="object-contain"
            />
          </div>
        </Link>
      )}

      <div className={mobile ? 'space-y-2' : 'flex grow flex-col justify-between px-3 py-4'}>
        <NavLinks mobile={mobile} onLinkClick={handleClick} />

        {/* Botón cerrar sesión en ambos modos */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={mobile
            ? 'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100'
            : 'flex items-center gap-3 rounded-lg p-3 text-sm font-medium bg-[#14262b] hover:bg-[#2d0e0b] transition-colors'}
        >
          <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
