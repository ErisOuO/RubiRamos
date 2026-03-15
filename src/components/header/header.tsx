'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  FaHome, 
  FaUserAlt, 
  FaShoppingBag, 
  FaCalendarAlt, 
  FaShoppingCart, 
  FaAddressCard,
  FaBars,
  FaTimes 
} from 'react-icons/fa';
import styles from './header.module.css';

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '/', icon: FaHome, label: 'Inicio' },
    { href: '/catalog', icon: FaShoppingBag, label: 'Catálogo' },
    { href: '/schedule', icon: FaCalendarAlt, label: 'Agendar Cita' },
    { href: '/shopping_cart', icon: FaShoppingCart, label: 'Carrito' },
    { href: '/historial', icon: FaAddressCard, label: 'Historial Médico' },
    { href: '/login', icon: FaUserAlt, label: 'Iniciar Sesión' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image 
              src="/logo_rubi.png" 
              alt="RubiRamos Logo" 
              width={270} 
              height={50} 
              priority
              className={styles.logo}
            />
          </Link>
        </div>

        {/* Botón menú móvil */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Navegación escritorio */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href} className={styles.navItem}>
                <Link 
                  href={link.href} 
                  className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
                >
                  <link.icon size={20} className={styles.icon} />
                  <span>{link.label}</span>
                  {isActive(link.href) && <div className={styles.activeIndicator}></div>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div ref={menuRef} className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <ul className={styles.mobileNavList}>
              {navLinks.map((link) => (
                <li key={link.href} className={styles.mobileNavItem}>
                  <Link 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.mobileActive : ''}`}
                  >
                    <link.icon size={20} className={styles.mobileIcon} />
                    <span>{link.label}</span>
                    {isActive(link.href) && <div className={styles.mobileActiveIndicator}></div>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;