'use client';

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { usePathname, useRouter } from 'next/navigation';
import styles from './ButtonLogin.module.css';
import { useMobileMenuStore } from '@/store/mobile';

type Props = {
  size?: 'medium';
};

/**
 * Кнопка "иконка" логина/разлогина на сайт
 */
const Login = ({ size }: Props) => {
  const { status } = useSession();
  const router = useRouter();
  const pathUrl = usePathname();
  const isAuthenticated = status === 'authenticated';
  const setMobileMenu = useMobileMenuStore((state) => state.setMobileMenu);
  const isMenuOpen = useMobileMenuStore((state) => state.isMenuOpen);

  const getClick = () => {
    if (isAuthenticated) {
      signOut({ redirect: false });
      toast.success('Вы вышли из системы');
    } else {
      router.push(`/auth/login?callbackUrl=${pathUrl}`, { scroll: false });
    }
    if (isMenuOpen) {
      setMobileMenu(false);
    }
  };
  return (
    <button className={styles.btn} onClick={getClick}>
      <Image
        className={styles.img}
        width={size === 'medium' ? 35 : 21}
        height={size === 'medium' ? 45 : 28}
        src={isAuthenticated ? '/images/icons/logout.svg' : '/images/icons/login.svg'}
        alt="login"
      />
    </button>
  );
};

export default Login;
