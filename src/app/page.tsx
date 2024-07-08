import { getServerSession } from 'next-auth';
import cn from 'classnames/bind';

import { authOptions } from './api/auth/[...nextauth]/auth-options';
import { getCalendarEvents } from '@/actions/calendar';
import Wrapper from '@/components/Wrapper/Wrapper';
import NewsShort from '@/components/NewsShort/NewsShort';
import BlockNews from '@/components/BlockNews/BlockNews';
import Webcam from '@/components/Webcam/Webcam';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import AdContainer from '@/components/AdContainer/AdContainer';
import BlockNewsImportant from '@/components/BlockNewsImportant/BlockNewsImportant';
import Calendar from '@/components/UI/Calendar/Calendar';
import styles from './Home.module.css';

const cx = cn.bind(styles);

/**
 * Главная (домашняя) страница сайта.
 */
export default async function Home() {
  const session = await getServerSession(authOptions);
  const events = await getCalendarEvents();
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <Wrapper title="Новости велоспорта на Северном Кавказе">
          <div className={styles.content}>
            <p className={styles.welcome}>
              Добро пожаловать на наш сайт, посвященный велоспорту на Северном Кавказе! Здесь вы
              найдете самые свежие и актуальные новости о велоспорте в нашем регионе, включая
              анонсы предстоящих соревнований, результаты заездов, информацию о бреветах и
              совместных выездах, а также обзоры лучших велосипедных маршрутов для шоссейных и
              горных велосипедов.
            </p>
            <NewsShort idUserDB={session?.user.idDB} />
            <BlockNewsImportant />

            <div className={cx('gap__aside', 'block__ad-mobile')}>
              <AdContainer adsNumber={8} />
            </div>

            <BlockNews idUserDB={session?.user.idDB} />
          </div>
        </Wrapper>
      </div>
      <aside className={styles.wrapper__aside}>
        <div className={styles.webcam__title__mobile}>
          <TitleAndLine hSize={2} title="Вебкамеры на горе Шаджатмаз" />
        </div>
        <div className={styles.box__webcam}>
          <Webcam />
        </div>

        <div className={cx('gap__aside', 'block__ad')}>
          <AdContainer adsNumber={8} />
        </div>

        <div className={styles.gap__aside}>
          <TitleAndLine hSize={2} title="Календарь событий" />
        </div>
        <Calendar events={events} />
      </aside>
    </div>
  );
}
