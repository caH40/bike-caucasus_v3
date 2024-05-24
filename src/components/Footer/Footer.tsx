import Image from 'next/image';
import Link from 'next/link';

import LogoMain from '../UI/LogoMain/LogoMain';
import styles from './Footer.module.css';
import { navLinksFull } from '@/constants/navigation';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.logo}>
          <LogoMain />
        </div>

        {/* Колонка карта сайта, ссылки на все страницы сайта */}
        <div className={styles.block}>
          <h4 className={styles.title}>Карта сайта:</h4>
          <ul className={styles.list}>
            {navLinksFull.map((link) => (
              <li className={styles.item} key={link.id}>
                <Link className={styles.link} href={link.href}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Колонка социальные сети */}
        <div className={styles.block}>
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
        </div>
      </div>

      <div className={styles.copyright}>Copyright © 2022 Bike-Caucasus</div>
    </footer>
  );
};

export default Footer;
