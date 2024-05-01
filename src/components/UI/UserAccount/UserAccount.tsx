'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import styles from './UserAccount.module.css';

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
      toast.info('Необходима авторизация');
    }
  };
  return (
    <button className={styles.btn} onClick={getClick}>
      <Image width={30} height={30} className={styles.img} src={avatar} alt="avatar" />
    </button>
  );
};

export default UserAccount;
