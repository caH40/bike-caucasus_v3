'use client';

import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';

import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const getClick = () => {
    signIn('vk', undefined);
  };

  return (
    <div>
      <h1>ProfilePage</h1>
      <p>Data Session: </p>
      <p>Status: {status}</p>
      <pre>{session && JSON.stringify(session, null, 2)}</pre>
      <button className={styles.btn}>
        <Image width={30} height={30} src="/images/icons/vk.svg" alt="vk" onClick={getClick} />
      </button>
    </div>
  );
}
