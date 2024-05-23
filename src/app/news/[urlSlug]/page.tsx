import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';

import InteractiveBlockNews from '@/components/UI/InteractiveBlockNews/InteractiveBlockNews';
import { News } from '@/services/news';
import { getTimerLocal } from '@/libs/utils/date-local';
import { getLogoProfile } from '@/libs/utils/profile';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import type { TNewsHetOneDto } from '@/types/dto.types';
import BlockShare from '@/components/BlockShare/BlockShare';
import styles from './NewsPage.module.css';
import { generateMetadataNews } from '@/constants/meta';
import { Metadata } from 'next';

// Создание динамических meta данных
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataNews(props);
}

type Props = {
  params: {
    urlSlug: string;
  };
};

/**
 * Получение данных новости с БД.
 */
export async function getNewsOne({
  urlSlug,
  idUserDB,
}: {
  urlSlug: string;
  idUserDB?: string;
}): Promise<TNewsHetOneDto | null | undefined> {
  try {
    const news = new News();
    const response = await news.getOne({ urlSlug, idUserDB });

    if (!response.ok) {
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error({ message: error.message }); // eslint-disable-line no-console
    }
    console.error(error); // eslint-disable-line no-console
  }
}

/**
 * Подсчет просмотра новости с _id:idNews.
 */
async function countView(idNews: string | undefined): Promise<void> {
  try {
    if (!idNews) {
      return;
    }
    // Учет просмотра новости.
    const news = new News();
    await news.countView({ idNews });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }
}

/**
 * Страница Новости
 */
export default async function NewsPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const newsOne = await getNewsOne({
    urlSlug: params.urlSlug,
    idUserDB: session?.user.idDB,
  });

  const idNews = newsOne?._id ? String(newsOne._id) : undefined;
  await countView(newsOne?._id);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        {newsOne && (
          <>
            <h1 className={styles.title}>{newsOne.title}</h1>

            {/*Блок об авторе новости и дате создания. */}
            <div className={styles.author}>
              <Link href={`/profile/${newsOne.author?.id}`} className={styles.author__name}>
                <Image
                  width={24}
                  height={24}
                  alt={'Постер новости'}
                  src={getLogoProfile(
                    newsOne.author?.imageFromProvider,
                    newsOne.author?.provider.image,
                    newsOne.author?.image
                  )}
                  className={styles.author__img}
                  priority={true}
                />
              </Link>
              {newsOne.author ? (
                <Link href={`/profile/${newsOne.author?.id}`} className={styles.author__name}>
                  {newsOne.author?.person.firstName} {newsOne.author?.person.lastName}
                </Link>
              ) : (
                <span>Неизвестный</span>
              )}

              <span className={styles.author__date}>
                {getTimerLocal(newsOne.createdAt, 'DDMMYYHm')}
              </span>
            </div>

            {/* Изображение-обложка новости. */}
            <div className={styles.box__img}>
              <Image
                src={newsOne.poster}
                fill={true}
                sizes="(max-width: 992px) 100vw, 70vw"
                alt={`image ${newsOne.title}`}
                className={styles.img}
                priority={true}
              />
            </div>

            {/* Подзаголовок (краткое содержание). */}
            <h2 className={styles.subtitle}>{newsOne.subTitle}</h2>

            {/* Тело новости состоящее из блоков текста и изображения к нему. */}
            <article className={styles.content}>
              {newsOne.blocks.map((block) => (
                <section className={styles.article__block} key={block.position}>
                  <p className={styles.content__text}>{block.text}</p>
                  {block.image && (
                    <div className={styles.content__box__img}>
                      <Image
                        fill={true}
                        src={block.image}
                        alt={`Картинка к блоку ${block.position}`}
                        sizes="(max-width: 992px) 100vw, 50vw"
                        className={styles.content__img}
                      />
                    </div>
                  )}
                </section>
              ))}
            </article>

            {/* Блок хэштегов. */}
            <p className={styles.tags}>
              {newsOne.hashtags.map((tag) => (
                <span key={tag}>{`#${tag}`}</span>
              ))}
            </p>

            {/* Интерактивный блок. */}
            <div className={styles.interactive}>
              <InteractiveBlockNews
                likesCount={newsOne.likesCount}
                isLikedByUser={newsOne.isLikedByUser}
                idNews={idNews}
                viewsCount={newsOne.viewsCount}
              />
            </div>
            <hr className={styles.line} />
            <BlockShare title={'Поделиться'} />
          </>
        )}
      </div>
      <aside className={styles.wrapper__aside}></aside>
    </div>
  );
}
