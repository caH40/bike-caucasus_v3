'use client';

import Link from 'next/link';
import Image from 'next/image';

import PermissionCheck from '@/hoc/permission-check';
import styles from './NavBarFooter.module.css';

// styles
import { TEmail, TLinkWithImage, TMenuPopup } from '@/types/index.interface';

type Props = {
  title: string;
  navLinks: TMenuPopup[];
  linksWithImage?: TLinkWithImage[];
  emails?: TEmail[];
};

/**
 * Компонент для отображения футера навигационной панели с проверкой разрешений на доступ к ссылкам.
 * @returns - JSX элемент, содержащий карту сайта с проверкой разрешений.
 */
export default function NavBarFooter({ title, navLinks, emails, linksWithImage }: Props) {
  return (
    <>
      <h4 className={styles.title}>{title}</h4>
      <ul className={styles.list}>
        {navLinks.map((link) => (
          <PermissionCheck permission={link.permission} key={link.id}>
            <li className={styles.item}>
              <Link className={styles.link} href={link.href}>
                {link.name}
              </Link>
            </li>
          </PermissionCheck>
        ))}

        {emails &&
          emails.map((email) => (
            <li className={styles.item} key={email.email}>
              <a href={`mailto:${email.email}`} className={styles.link}>
                {email.name}
              </a>
            </li>
          ))}

        {linksWithImage &&
          linksWithImage.map((link) => (
            <li className={styles.item} key={link.id}>
              <a href={link.href} className={styles.link__image} target="_blank">
                <Image
                  width={20}
                  height={20}
                  className={styles.social__img}
                  src="/images/icons/telegram.svg"
                  alt="telegram"
                />
                <span className={styles.link}>{link.name}</span>
              </a>
            </li>
          ))}
      </ul>
    </>
  );
}
