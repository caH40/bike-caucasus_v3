import { type Metadata } from 'next';

import Webcam from '@/components/Webcam/Webcam';
import { generateMetadataWebcam } from '@/meta/meta';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import AdContainer from '@/components/AdContainer/AdContainer';
import styles from './WebcamPage.module.css';

// Создание динамических meta данных
export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataWebcam();
}

/**
 * Страница популярных вебкамер
 */
export default function WebcamPage() {
  return (
    <main className={styles.wrapper}>
      <section className={styles.wrapper__main}>
        <TitleAndLine
          hSize={1}
          title="Вебкамеры на горе Шаджатмаз Кавказской Горной Обсерватории"
        />
        <div>
          <Webcam forFullScr={true} />

          <div className={styles.author}>
            <span>Изображения с сайта</span>
            <a href="https://cmo-env.sai.msu.ru/webcam/" className={styles.link} target="blank">
              https://cmo-env.sai.msu.ru/webcam/
            </a>
          </div>
        </div>
      </section>

      {/* Боковая панель. */}
      <aside className={styles.wrapper__aside}>
        <AdContainer adsNumber={5} />
      </aside>

      {/* Рекомендательный виджет (реклама) */}
      <div className={styles.rtb}>
        <AdContainer adsNumber={12} maxWidth={1105} />
      </div>
    </main>
  );
}
