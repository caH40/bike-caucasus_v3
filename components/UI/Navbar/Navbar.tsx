'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';

import styles from './Navbar.module.css';

const cx = classNames.bind(styles);

const links = [
  { id: 0, name: 'Главная', href: '/' },
  { id: 1, name: 'Вебкамеры', href: '/webcam' },
  { id: 2, name: 'Маршруты', href: '/trails' },
  { id: 3, name: 'Галерея', href: '/gallery' },
  { id: 4, name: 'Джилы-Су', href: '/dzhilsu' },
  { id: 5, name: 'Админ', href: '/admin' },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {links.map((link) => (
          <li className={styles.item} key={link.id}>
            <Link className={cx('link', { active: pathname === link.href })} href={link.href}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
