import Navbar from '../UI/Navbar/Navbar';
import UserAccount from '../UI/UserAccount/UserAccount';
import ButtonLogin from '../UI/ButtonLogin/ButtonLogin';

import styles from './Header.module.css';
import LogoMain from '../UI/LogoMain/LogoMain';
import Burger from '../UI/Burger/Burger';

export default async function Header() {
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

            {/* кнопка входа */}
            <ButtonLogin />

            {/* бургер в мобильной версии, когда разрешение меньше 992px */}
            <Burger />
          </div>
        </div>
      </div>
    </header>
  );
}
