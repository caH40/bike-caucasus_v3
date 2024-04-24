'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

import styles from './UserAccount.module.css';

const UserAccount = () => {
  const { status } = useSession();

  const avatar = '/images/avatar.svg';
  // const getClick = () => {
  //   if (isAuth.status) {
  //     navigate('/profile');
  //     if (!size.isScreenLg) updateMenu();
  //   } else {
  //     dispatch(getAlert({ message: 'Необходима авторизация', type: 'info', isOpened: true }));
  //   }
  // };
  return (
    <>
      <Image width={30} height={30} className={styles.img} src={avatar} alt="avatar" />
    </>
  );
};

export default UserAccount;
