'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { toast } from 'sonner';
import cn from 'classnames/bind';

import { useMobileMenuStore } from '@/store/mobile';
import { usePopupUserStore } from '@/store/popup-user';
import styles from './UserAccount.module.css';
import PopupMenu from '../PopupMenu/PopupMenu';
import { getNavLinksUserPopup } from '@/constants/navigation';

const cx = cn.bind(styles);

/**
 * Кнопка с изображением профиля для входа в систему/в профиль
 */
const UserAccount = () => {
  const { status, data: session } = useSession();
  const isMenuOpen = useMobileMenuStore((state) => state.isMenuOpen);
  const { isVisible, setMenu } = usePopupUserStore();

  const avatar =
    status === 'authenticated' && session.user?.image
      ? session.user.image
      : '/images/icons/avatar.svg';

  const getClick = () => {
    if (isMenuOpen) {
      return;
    }
    if (status === 'authenticated') {
      setMenu(!isVisible);
      // setMobileMenu(false);
    } else {
      toast.info('Необходима авторизация');
    }
  };
  return (
    <>
      <button className={cx('btn', { focus: isVisible })} onClick={getClick}>
        <Image
          width={30}
          height={30}
          className={styles.img}
          src={avatar}
          alt="avatar"
          quality={100}
        />
      </button>
      {isVisible && (
        <div
          className={styles.block__popup}
          onClick={() => setMenu(false)}
          onMouseLeave={() => setMenu(false)}
        >
          <PopupMenu navLinks={getNavLinksUserPopup} />
        </div>
      )}
    </>
  );
};

export default UserAccount;
