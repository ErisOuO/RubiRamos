'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { FaHome, FaUserAlt } from 'react-icons/fa';
import styles from './header.module.css';

const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo 
        
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="AutoClick Logo" 
              width={270} 
              height={50} 
              priority
              className={styles.logo}
            />
          </Link>
        </div>
        */}

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