import Image from 'next/image';
import Link from 'next/link';

/**
 * Главное лого сайта
 */
export default function LogoMain() {
  return (
    <Link href={'/'}>
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
