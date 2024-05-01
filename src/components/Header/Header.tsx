import Navbar from '../UI/Navbar/Navbar';
import UserAccount from '../UI/UserAccount/UserAccount';
import ButtonLogin from '../UI/ButtonLogin/ButtonLogin';

import styles from './Header.module.css';
import LogoMain from '../UI/LogoMain/LogoMain';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <LogoMain />
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
