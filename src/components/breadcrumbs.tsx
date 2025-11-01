import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav
      className="w-full 
                 bg-gradient-to-b from-[#B8FF80] via-[#6FEA50] to-[#3DAE26]
                 border-b-[1px] border-[#FF7C00]
                 px-6 py-2 text-sm text-white shadow-lg"
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="text-white hover:text-[#FF7C00] font-semibold transition-colors"
          >
            Inicio
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 text-[#FF7C00]" />
              {isLast ? (
                <span className="text-white font-bold capitalize drop-shadow-md">
                  {decodeURIComponent(segment)}
                </span>
              ) : (
                <Link
                  href={href}
                  className="text-white hover:text-[#FF7C00] capitalize transition-colors"
                >
                  {decodeURIComponent(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
