'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { FaHome, FaUserAlt, FaShoppingBag, FaCalendarAlt, FaShoppingCart, FaAddressCard } from 'react-icons/fa';
import styles from './header.module.css';

const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
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

        {/* Navegación */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link 
                href="/" 
                className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
              >
                <FaHome size={24} className={styles.icon} />
                <span>Inicio</span>
                {isActive('/') && <div className={styles.activeIndicator}></div>}
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link 
                href="/catalog" 
                className={`${styles.navLink} ${isActive('/catalog') ? styles.active : ''}`}
              >
                <FaShoppingBag size={24} className={styles.icon} />
                <span>Catálogo</span>
                {isActive('/catalog') && <div className={styles.activeIndicator}></div>}
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link 
                href="/schedule" 
                className={`${styles.navLink} ${isActive('/schedule') ? styles.active : ''}`}
              >
                <FaCalendarAlt size={24} className={styles.icon} />
                <span>Agendar Cita</span>
                {isActive('/schedule') && <div className={styles.activeIndicator}></div>}
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link 
                href="/shopping_cart" 
                className={`${styles.navLink} ${isActive('/shopping_cart') ? styles.active : ''}`}
              >
                <FaShoppingCart size={24} className={styles.icon} />
                <span>Carrito</span>
                {isActive('/shopping_cart') && <div className={styles.activeIndicator}></div>}
              </Link>
            </li>       
            
            <li className={styles.navItem}>
              <Link 
                href="/historial" 
                className={`${styles.navLink} ${isActive('/historial') ? styles.active : ''}`}
              >
                <FaAddressCard size={24} className={styles.icon} />
                <span>Historial Médico</span>
                {isActive('/historial') && <div className={styles.activeIndicator}></div>}
              </Link>
            </li>                        

            <li className={styles.navItem}>
              <Link 
                href="/login" 
                className={`${styles.navLink} ${isActive('/login') ? styles.active : ''}`}
              >
                <FaUserAlt size={24} className={styles.icon} />
                <span>Iniciar Sesión</span>
                {isActive('/login') && <div className={styles.activeIndicator}></div>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;