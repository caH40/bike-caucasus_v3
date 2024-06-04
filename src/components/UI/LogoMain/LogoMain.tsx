import Image from 'next/image';
import Link from 'next/link';

import styles from './LogoMain.module.css';

/**
 * Главное лого сайта
 */
export default function LogoMain() {
  return (
    <Link href={'/'} className={styles.link}>
      <Image
        priority={true}
        width={'199'}
        height={'51'}
        src="/images/icons/logo.svg"
        alt="Logo"
      />
    </Link>
  );
}
