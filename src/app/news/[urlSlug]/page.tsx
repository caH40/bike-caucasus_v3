import { Metadata } from 'next';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

import Author from '@/components/Author/Author';
import BlockShare from '@/components/BlockShare/BlockShare';
import { News } from '@/services/news';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { generateMetadataNews } from '@/meta/meta';
import { errorLogger } from '@/errors/error';
import { notFound } from 'next/navigation';
import { blurBase64 } from '@/libs/image';
import AdContainer from '@/components/AdContainer/AdContainer';
import Wrapper from '@/components/Wrapper/Wrapper';
import InteractiveBlock from '@/components/UI/InteractiveBlock/InteractiveBlock';
import BlockComments from '@/components/BlockComments/BlockComments';
import { getComments } from '@/actions/comment';
import MenuForNews from '@/components/UI/Menu/MenuControl/MenuForNews';
import type { TNewsGetOneDto } from '@/types/dto.types';
import styles from './NewsPage.module.css';
import PermissionCheck from '@/hoc/permission-check';

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
  const news = new News();
  const response = await news.getOne({ urlSlug, idUserDB });

  if (!response.ok) {
    return null;
  }

  return response.data;
}

/**
 * Подсчет просмотра новости с _id:idNews.
 */
async function countView(idNews: string): Promise<void> {
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

  const idUserDB = session?.user.idDB;
  const newsOne = await getNewsOne({
    urlSlug: params.urlSlug,
    idUserDB,
  });

  // если нет Новости (или возникла ошибка на сервере) показывается страница 404.
  if (!newsOne) {
    notFound();
  }

  const idNews = String(newsOne._id);
  await countView(idNews);

  const comments = await getComments({
    document: { _id: newsOne._id, type: 'news' },
    idUserDB,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        {/* popup меня управления новостью */}
        <PermissionCheck permission={'admin'}>
          <div className={styles.ellipsis} id="popup-control-menu-news">
            <MenuForNews newsUrlSlug={newsOne.urlSlug} />
          </div>
        </PermissionCheck>

        <Wrapper title={newsOne.title} hSize={1}>
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
              blurDataURL={blurBase64}
            />
          </div>

          {/* Подзаголовок (краткое содержание). */}
          <h2 className={styles.subtitle}>{newsOne.subTitle}</h2>

          {/* Тело новости состоящее из блоков текста и изображения к нему. */}
          <article className={styles.content}>
            {newsOne.blocks.map(async (block) => (
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
                        blurDataURL={blurBase64}
                      />
                    </div>
                    <h4 className={styles.img__title}>{block.imageTitle}</h4>
                  </div>
                )}
              </section>
            ))}

            {/* Блок с прикрепленными файлами */}
            {newsOne.filePdf && (
              <div className={styles.block__files}>
                <span>Прикрепленные файлы:</span>
                <Link
                  className={'link__news '}
                  target="blank"
                  href={newsOne.filePdf}
                  rel="noreferrer"
                >
                  Финишный протокол
                </Link>
              </div>
            )}
          </article>

          {/* Блок хэштегов. */}
          <p className={styles.tags}>
            {newsOne.hashtags.map((tag) => (
              <span key={tag}>{`#${tag}`}</span>
            ))}
          </p>

          {/* Интерактивный блок. */}
          <div className={styles.interactive}>
            <InteractiveBlock
              likesCount={newsOne.likesCount}
              isLikedByUser={newsOne.isLikedByUser}
              idDocument={idNews}
              viewsCount={newsOne.viewsCount}
              commentsCount={comments.length}
              target="news"
            />
          </div>
          <hr className={styles.line} />

          {/* Поделится в социальных сетях */}
          <BlockShare title={'Поделиться'} />
          <hr className={styles.line} />

          {/* Блок комментариев */}
          <div className={styles.block__comments}>
            <BlockComments
              comments={comments}
              authorId={newsOne.author.id}
              userId={session?.user.id ? +session?.user.id : null}
              document={{ _id: newsOne._id, type: 'news' }}
              idUserDB={idUserDB}
            />
          </div>
        </Wrapper>
      </div>
      <aside className={styles.wrapper__aside}>
        <AdContainer adsNumber={7} />
      </aside>
    </div>
  );
}
