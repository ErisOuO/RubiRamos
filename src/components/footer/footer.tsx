import Link from 'next/link';
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import styles from './footer.module.css'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Sección de navegación */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Consultorio</h3>
          <ul className={styles.navList}>
            <li>
              <Link href="/quienessomos" className={styles.navLink}>
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link href="/servicios" className={styles.navLink}>
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/citas" className={styles.navLink}>
                Agenda tu Cita
              </Link>
            </li>
          </ul>
        </div>

        {/* Sección legal */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Legal</h3>
          <ul className={styles.navList}>
            <li>
              <Link href="/politicas" className={styles.navLink}>
                Aviso de Privacidad
              </Link>
            </li>
            <li>
              <Link href="/terminos" className={styles.navLink}>
                Términos y Condiciones
              </Link>
            </li>
          </ul>
        </div>

        {/* Sección de contacto */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Contacto</h3>
          <ul className={styles.contactList}>
            <li>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>Av. Bienestar #321, CDMX</span>
            </li>
            <li>
              <FaPhone className={styles.contactIcon} />
              <span>+52 55 9876 5432</span>
            </li>
            <li>
              <FaEnvelope className={styles.contactIcon} />
              <span>contacto@consultoriovitalcare.com</span>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Síguenos</h3>
          <div className={styles.socialIcons}>
            <a
              href="https://facebook.com/consultoriovitalcare"
              title="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FaFacebook size={22} />
            </a>
            <a
              href="https://instagram.com/consultoriovitalcare"
              title="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FaInstagram size={22} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>&copy; {currentYear} Consultorio Rubí Ramos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;