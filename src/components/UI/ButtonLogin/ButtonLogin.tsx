'use client';

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

import styles from './ButtonLogin.module.css';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Кнопка "иконка" логина/разлогина на сайт
 */
const Login = () => {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === 'authenticated';

  const getClick = () => {
    if (isAuthenticated) {
      signOut({ redirect: false });
      toast('Вы вышли из системы', {
        className: 'toast-success',
      });
    } else {
      router.push('/auth/login', { scroll: false });
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
