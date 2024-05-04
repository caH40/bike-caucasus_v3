import Link from 'next/link';

import AuthBlock from '@/components/UI/AuthBlock/AuthBlock';
import styles from './access-denied.module.css';

export default function AccessDenied() {
  return (
    <AuthBlock>
      <h1 className={styles.title}>Отказ в доступе</h1>
      <div className={styles.text}>
        Непредвиденная ошибка при аутентификации. Возможные причины:
        <ul className={styles.list}>
          <li>не получены данные из провайдера доступа (соцсеть)</li>
          <li>
            в системе есть пользователь с таким же email (при входе через разные провайдеры,
            создаются разные аккаунты и их email могут совпадать)
          </li>
        </ul>
      </div>
      <div>
        <Link href="/" className={styles.link}>
          на главную
        </Link>
      </div>
    </AuthBlock>
  );
}
