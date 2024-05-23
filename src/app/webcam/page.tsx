import TitleAndLine from '@/components/UI/TitleAndLine/TitleAndLine';
import Webcam from '@/components/Webcam/Webcam';

import styles from './WebcamPage.module.css';

/**
 * Страница популярных вебкамер
 */
export default function WebcamPage() {
  return (
    <div>
      <TitleAndLine title={'Вебкамеры'} hSize={1} />
      <h2 className={styles.title__h2}>Гора Шаджатмаз</h2>
      <Webcam forFullScr={true} />
    </div>
  );
}
