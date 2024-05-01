import Image from 'next/image';

import Navbar from '../UI/Navbar/Navbar';
import UserAccount from '../UI/UserAccount/UserAccount';
import ButtonLogin from '../UI/ButtonLogin/ButtonLogin';

import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <Image
            priority={true}
            width={'199'}
            height={'51'}
            src="/images/icons/logo.svg"
            alt="Logo"
          />
        </div>
        <div className={styles.navbar}>
          <Navbar />

          <div className={styles.box__auth}>
            <div className={styles.box__user}>
              <UserAccount />
            </div>

            <ButtonLogin />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
