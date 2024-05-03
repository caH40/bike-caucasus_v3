import Link from 'next/link';

import AuthBlock from '@/components/UI/AuthBlock/AuthBlock';
import styles from './access-denied.module.css';

export default function AccessDenied() {
  return (
    <AuthBlock>
      <h1 className={styles.title}>Отказ в доступе</h1>
      <div>
        <ol className={styles.list}>
          <li>Сначала зарегистрируйтесь на сайте, введя свои данные.</li>
          <li>
            После регистрации привяжите <b>yandex</b>, <b>vk</b> или <b>google</b> для быстрого
            входа.
          </li>
          <li>
            Теперь вы можете использовать этот провайдер для быстрой аутентификации без
            необходимости вводить учетные данные.
          </li>
        </ol>
        <Link href="/" className={styles.link}>
          на главную
        </Link>
      </div>
    </AuthBlock>
  );
}
