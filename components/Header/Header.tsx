import Image from 'next/image';

import Navbar from '../UI/Navbar/Navbar';

import styles from './Header.module.css';
import UserAccount from '@/UI/UserAccount/UserAccount';
import Login from '../UI/Login/Login';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <Image width={'199'} height={'51'} src="/images/icons/logo.svg" alt="Logo" />
        </div>
        <div className={styles.navbar}>
          <Navbar />

          <div className={styles.box__auth}>
            <div className={styles.box__user}>
              <UserAccount />
            </div>

            <Login />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
