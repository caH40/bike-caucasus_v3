'use client';

import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from './Login.module.css';

const Login = () => {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const getClick = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      signIn();
    }
  };
  return (
    <Image
      className={styles.img}
      width={21}
      height={28}
      src={isAuthenticated ? '/images/icons/logout.svg' : '/images/icons/login.svg'}
      alt="login"
      onClick={getClick}
    />
  );
};

export default Login;
