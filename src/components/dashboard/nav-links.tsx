'use client';

import {
  UserGroupIcon,
  HomeIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Inicio', href: '/admin', icon: HomeIcon },
  { name: 'Pacientes', href: '/admin/pacientes', icon: UserGroupIcon },
  { name: 'Citas', href: '/admin/calendar', icon: CalendarIcon },
  /*
  { name: 'Marcas', href: '/admin/marcas', icon: CogIcon },
  { name: 'Modelos', href: '/admin/modelos', icon: TruckIcon },
  { name: 'Versiones', href: '/admin/versiones', icon: GlobeAmericasIcon },
  { name: 'Rangos de Kilometraje', href: '/admin/rangos', icon: QueueListIcon },
  { name: 'Facturas', href: '/admin/facturas', icon: ReceiptPercentIcon },
  { name: 'Ajuste de Precios', href: '/admin/precios', icon: CurrencyDollarIcon },
  */
];

export default function NavLinks({ mobile = false, onLinkClick }: { mobile?: boolean, onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1 px-2">
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
              'flex items-center gap-3 rounded-lg p-2 text-sm font-medium transition-colors',
              mobile
                ? isActive
                  ? 'bg-gray-200 text-black'
                  : 'text-gray-800 hover:bg-gray-100'
                : isActive
                ? 'bg-[#14262b] text-white'
                : 'text-[#a8d8ea] hover:bg-[#14262b] hover:text-white'
            )}
          >
            <LinkIcon className="h-5 w-5" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
