import { Metadata } from 'next';
import Image from 'next/image';
import { getServerSession } from 'next-auth';

import InteractiveBlockNews from '@/components/UI/InteractiveBlockNews/InteractiveBlockNews';
import Author from '@/components/Author/Author';
import BlockShare from '@/components/BlockShare/BlockShare';
import { News } from '@/services/news';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { generateMetadataNews } from '@/meta/meta';
import { errorLogger } from '@/errors/error';
import { getBlur } from '@/libs/utils/blur';
import type { TNewsGetOneDto } from '@/types/dto.types';
import styles from './NewsPage.module.css';
import { notFound } from 'next/navigation';

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
}): Promise<TNewsGetOneDto | null | undefined> {
  try {
    const news = new News();
    const response = await news.getOne({ urlSlug, idUserDB });

    if (!response.ok) {
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    notFound();
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
    errorLogger(error);
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

  const posterWithBlur = await getBlur(newsOne?.poster);

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
              <Author data={{ author: newsOne.author, createdAt: newsOne.createdAt }} />
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
                placeholder="blur"
                blurDataURL={posterWithBlur}
              />
            </div>

            {/* Подзаголовок (краткое содержание). */}
            <h2 className={styles.subtitle}>{newsOne.subTitle}</h2>

            {/* Тело новости состоящее из блоков текста и изображения к нему. */}
            <article className={styles.content}>
              {newsOne.blocks.map(async (block) => {
                const imageWithBlur = await getBlur(block?.image);
                return (
                  <section className={styles.article__block} key={block.position}>
                    <div
                      className={styles.content__text}
                      dangerouslySetInnerHTML={{ __html: block.text }}
                    />

                    {block.image && (
                      <div className={styles.block__img}>
                        <div className={styles.content__box__img}>
                          <Image
                            fill={true}
                            src={block.image}
                            alt={`Картинка к блоку ${block.position}`}
                            sizes="(max-width: 992px) 100vw, 50vw"
                            className={styles.content__img}
                            placeholder="blur"
                            blurDataURL={imageWithBlur}
                          />
                        </div>
                        <h4 className={styles.img__title}>{block.imageTitle}</h4>
                      </div>
                    )}
                  </section>
                );
              })}
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
