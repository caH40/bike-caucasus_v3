'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

import styles from './UserAccount.module.css';
import { useRouter } from 'next/navigation';

const UserAccount = () => {
  const { status, data: session } = useSession();
  const router = useRouter();

  const avatar =
    status === 'authenticated' && session.user?.image
      ? session.user.image
      : '/images/avatar.svg';
  const getClick = () => {
    if (status === 'authenticated') {
      router.push('/profile');
    } else {
      console.log('Необходима авторизация'); // eslint-disable-line
    }
  };
  return (
    <button className={styles.btn} onClick={getClick}>
      <Image width={30} height={30} className={styles.img} src={avatar} alt="avatar" />
    </button>
  );
};

export default UserAccount;
