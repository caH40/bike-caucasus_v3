'use client';

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

import styles from './Login.module.css';
import { useRouter } from 'next/navigation';

const Login = () => {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === 'authenticated';

  const getClick = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      router.push('/auth/login');
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
