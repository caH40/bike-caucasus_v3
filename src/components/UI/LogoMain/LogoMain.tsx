import Image from 'next/image';

/**
 * Главное лого сайта
 */
export default function LogoMain() {
  return (
    <Image
      priority={true}
      width={'199'}
      height={'51'}
      src="/images/icons/logo.svg"
      alt="Logo"
    />
  );
}
