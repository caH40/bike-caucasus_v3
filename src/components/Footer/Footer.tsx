import {
  mapNavLinksFull,
  socialLinks,
  supportEmails,
  supportLinks,
} from '@/constants/navigation';
import { legalLinks } from '@/constants/navigation';
import LogoMain from '../UI/LogoMain/LogoMain';
import NavBarFooter from '../UI/NavBarFooter/NavBarFooter';
import styles from './Footer.module.css';
// import Requisites from '../Requisites/Requisites';

/**
 * Подвал сайта.
 */
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.logo}>
          <LogoMain />
        </div>

        {/* Колонка контактных данных поддержки и разработки */}
        <nav className={styles.block}>
          <NavBarFooter
            navLinks={[]}
            title={'Техническая поддержка:'}
            emails={supportEmails}
            linksWithImage={supportLinks}
          />
        </nav>

        {/* Колонка карта сайта, ссылки на все страницы сайта */}
        <nav className={styles.block}>
          <NavBarFooter title={'Карта сайта:'} navLinks={mapNavLinksFull} />
        </nav>

        {/* Колонка карта сайта, ссылки на все страницы сайта */}

        <nav className={styles.block}>
          <NavBarFooter title={'Документы:'} navLinks={legalLinks} />
        </nav>

        {/* Колонка социальные сети */}
        <nav className={styles.block}>
          <NavBarFooter navLinks={[]} title={'Соцсети:'} linksWithImage={socialLinks} />
        </nav>

        {/* <Requisites /> */}
      </div>

      <div className={styles.copyright}>Copyright © 2022 Bike-Caucasus</div>
    </footer>
  );
};

export default Footer;
