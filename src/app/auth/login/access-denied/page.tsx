import Link from 'next/link';

import AuthBlock from '@/components/UI/AuthBlock/AuthBlock';
import styles from './access-denied.module.css';

export default function AccessDenied() {
  return (
    <AuthBlock>
      <h1 className={styles.title}>Отказ в доступе</h1>
      Непредвиденная ошибка при аутентификации
      <div>
        <Link href="/" className={styles.link}>
          на главную
        </Link>
      </div>
    </AuthBlock>
  );
}
