import Image from 'next/image';

import Navbar from '../UI/Navbar/Navbar';

import styles from './Header.module.css';
import Link from 'next/link';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <Image width={'199'} height={'51'} src="/images/icons/logo.svg" alt="Logo" />
        </div>
        <div className={styles.navbar}>
          {/* <Adaptive sizeScreen="lg"> */}
          <Navbar />
          <Link href="/api/auth/signin">Login</Link>
          {/* <div className={styles.box__user}>
                <UserAccount isAuth={isAuth} />
              </div> */}
          {/* <div className={styles.item__login}>
                <Login isAuth={isAuth} />
              </div> */}
          {/* </Adaptive> */}
          {/* <Adaptive sizeScreen="lg" visible={true}>
              <NavbarMobile />
            </Adaptive> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
