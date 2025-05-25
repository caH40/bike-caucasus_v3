import DocumentFromJSON from '@/components/DocumentFromJSON/DocumentFromJSON';
import tPP from '@/locales/ru/privacy-policy.json';
import tAP from '@/locales/ru/application-1.json';

import styles from '../Legal.module.css';

/**
 * Страница "Политика конфиденциальности".
 */
export default function PrivacyPolicy() {
  return (
    <div className={styles.wrapper}>
      <DocumentFromJSON dataJson={tPP.privacyPolicy} />
      <DocumentFromJSON dataJson={tAP.applicationPrivacyPolicy} />
    </div>
  );
}
