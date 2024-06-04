import { type Metadata } from 'next';

import Webcam from '@/components/Webcam/Webcam';

import styles from './WebcamPage.module.css';
import { generateMetadataWebcam } from '@/meta/meta';
import Wrapper from '@/components/Wrapper/Wrapper';

// Создание динамических meta данных
export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataWebcam();
}

/**
 * Страница популярных вебкамер
 */
export default function WebcamPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <Wrapper title={'Вебкамеры'}>
          <div>
            <Webcam forFullScr={true} />
            <div className={styles.author}>
              <span>Изображения с сайта</span>
              <a href="https://gw.cmo.sai.msu.ru/" className={styles.link}>
                https://gw.cmo.sai.msu.ru/
              </a>
            </div>
          </div>
        </Wrapper>
      </div>
      <aside className={styles.wrapper__aside}></aside>
    </div>
  );
}
