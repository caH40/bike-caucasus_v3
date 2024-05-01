import Image from 'next/image';
import Link from 'next/link';

import LogoMain from '../UI/LogoMain/LogoMain';
import styles from './Footer.module.css';

const links1 = [
  { id: 0, name: 'Главная', href: '/' },
  { id: 1, name: 'Маршруты', href: '/trails' },
  { id: 2, name: 'Джилы-Су', href: '/dzhilsu' },
  { id: 3, name: 'Галерея', href: '/gallery' },
];
const links2 = [{ id: 0, name: 'Вебкамеры', href: '/webcam' }];

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.logo}>
          <LogoMain />
        </div>
        <ul className={styles.list}>
          {links1.map((link) => (
            <li className={styles.item} key={link.id}>
              <Link className={styles.link} href={link.href}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className={styles.list}>
          {links2.map((link) => (
            <li className={styles.item} key={link.id}>
              <Link className={styles.link} href={link.href}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className={styles.list__social}>
          <li className={styles.item}>
            <a href="https://t.me/velokmv">
              <Image
                width={30}
                height={30}
                className={styles.social__img}
                src="/images/icons/telegram.svg"
                alt="telegram"
              />
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.copyright}>Copyright © 2022 Bike-Caucasus</div>
    </footer>
  );
};

export default Footer;
