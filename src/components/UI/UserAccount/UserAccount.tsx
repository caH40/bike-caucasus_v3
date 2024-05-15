'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import styles from './UserAccount.module.css';
import { useMobileMenuStore } from '@/store/mobile';

/**
 * Кнопка с изображением профиля для входа в систему/в профиль
 */
const UserAccount = () => {
  const { status, data: session } = useSession();
  const setMobileMenu = useMobileMenuStore((state) => state.setMobileMenu);
  const router = useRouter();

  const avatar =
    status === 'authenticated' && session.user?.image
      ? session.user.image
      : '/images/icons/avatar.svg';
  const getClick = () => {
    if (status === 'authenticated') {
      router.push(`/profile/${session.user.id}`);
      setMobileMenu(false);
    } else {
      toast.info('Необходима авторизация');
    }
  };
  return (
    <button className={styles.btn} onClick={getClick}>
      <Image
        width={30}
        height={30}
        className={styles.img}
        src={avatar}
        alt="avatar"
        quality={100}
      />
    </button>
  );
};

export default UserAccount;
