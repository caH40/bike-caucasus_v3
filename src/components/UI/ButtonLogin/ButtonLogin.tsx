'use client';

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

import styles from './ButtonLogin.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Кнопка "иконка" логина/разлогина на сайт
 */
const Login = () => {
  const { status } = useSession();
  const router = useRouter();
  const pathUrl = usePathname();
  const isAuthenticated = status === 'authenticated';

  const getClick = () => {
    if (isAuthenticated) {
      signOut({ redirect: false });
      toast.success('Вы вышли из системы');
    } else {
      router.push(`/auth/login?callbackUrl=${pathUrl}`, { scroll: false });
    }
  };
  return (
    <button className={styles.btn} onClick={getClick}>
      <Image
        className={styles.img}
        width={21}
        height={28}
        src={isAuthenticated ? '/images/icons/logout.svg' : '/images/icons/login.svg'}
        alt="login"
      />
    </button>
  );
};

export default Login;