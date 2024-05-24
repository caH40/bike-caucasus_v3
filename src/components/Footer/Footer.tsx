import Image from 'next/image';

import LogoMain from '../UI/LogoMain/LogoMain';
import styles from './Footer.module.css';
import NavBarFooter from '../UI/NavBarFooter/NavBarFooter';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.logo}>
          <LogoMain />
        </div>

        {/* Колонка карта сайта, ссылки на все страницы сайта */}
        <nav className={styles.block}>
          <NavBarFooter />
        </nav>

        {/* Колонка социальные сети */}
        <nav className={styles.block}>
          <h4 className={styles.title}>Соцсети:</h4>
          <ul className={styles.list__social}>
            <li className={styles.item}>
              <a href="https://t.me/velokmv">
                <Image
                  width={24}
                  height={24}
                  className={styles.social__img}
                  src="/images/icons/telegram.svg"
                  alt="telegram"
                />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.copyright}>Copyright © 2022 Bike-Caucasus</div>
    </footer>
  );
};

export default Footer;
