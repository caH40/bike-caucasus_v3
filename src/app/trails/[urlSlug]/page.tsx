import { getServerSession } from 'next-auth';
import { type Metadata } from 'next';
import Image from 'next/image';
import cn from 'classnames/bind';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

import Wrapper from '@/components/Wrapper/Wrapper';
import { regions } from '@/constants/trail';
import BlockShare from '@/components/BlockShare/BlockShare';
import TrailTotal from '@/components/TrailTotal/TrailTotal';
import { getTrail } from '@/actions/trail';
import { generateMetadataTrail } from '@/meta/meta';
import { blurBase64 } from '@/libs/image';
import { Trail } from '@/services/Trail';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import InteractiveBlock from '@/components/UI/InteractiveBlock/InteractiveBlock';
import BlockComments from '@/components/BlockComments/BlockComments';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getComments } from '@/actions/comment';
import Weather from '@/components/Weather/Weather';
import Author from '@/components/Author/Author';
const MapWithElevation = dynamic(() => import('@/components/Map/MapWrapper'));
import PermissionCheck from '@/hoc/permission-check';
import MenuEllipsisControl from '@/components/UI/Menu/MenuControl/MenuEllipsisControl';
import { getNavLinksTrailPopup } from '@/constants/navigation';
import styles from './TrailPage.module.css';

const cx = cn.bind(styles);

// Создание динамических meta данных
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataTrail(props);
}

type Props = {
  params: Promise<{
    urlSlug: string;
  }>;
};

export default async function TrailPage(props: Props) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  const idUserDB = session?.user.idDB;

  // Мета данные запроса для логирования ошибок.
  const debugMeta = {
    caller: 'ProfilePage',
    authUserId: session?.user.id,
    rawParams: params,
    path: `/trails/${params.urlSlug}`,
  };

  const trail = await getTrail({ urlSlug: params.urlSlug, debugMeta });

  // если нет Маршрута (или возникла ошибка на сервере) показывается страница 404.
  if (!trail) {
    notFound();
  }

  // Подсчет просмотров Маршрута.
  const trailService = new Trail();
  await trailService.countView(params.urlSlug);

  const comments = await getComments({
    document: { _id: trail._id, type: 'trail' },
    idUserDB,
  });

  return (
    <>
      {/* popup меня управления новостью */}
      <PermissionCheck permission={'moderation.trails'} moderatorIds={trail.moderatorIds}>
        <div className={styles.ellipsis} id="popup-control-menu-trail">
          <MenuEllipsisControl
            urlSlug={trail.urlSlug}
            id={'#popup-control-menu-trail'}
            getMenuItems={getNavLinksTrailPopup}
            messageTooltip={'Управление маршрутом'}
          />
        </div>
      </PermissionCheck>

      <Wrapper
        title={`${trail.title} - велосипедный маршрут в регионе ${
          regions.find((region) => region.name === trail.region)?.translation || ''
        }`}
      >
        <div className={styles.main}>
          <div className={styles.author}>
            <Author data={{ author: trail.author, createdAt: trail.createdAt }} />
          </div>

          {/* Изображение-обложка новости. */}
          <div className={styles.box__img}>
            <Image
              src={trail.poster}
              fill={true}
              sizes="(max-width: 992px) 100vw, 70vw"
              alt={`image ${trail.title}`}
              className={styles.img}
              priority={true}
              blurDataURL={blurBase64}
              placeholder="blur"
            />
          </div>
          <div className={styles.content}>
            {trail.blocks.map(async (block) => (
              <article className={cx('wrapper__block')} key={block._id}>
                <h2 className={styles.block__title}>{block.title}</h2>
                <div
                  className={cx('block__text', { full: !block.image })}
                  dangerouslySetInnerHTML={{ __html: block.text }}
                />

                {block.image && (
                  <figure>
                    <div className={styles.block__box__img}>
                      <Image
                        src={block.image}
                        fill={true}
                        sizes="(max-width: 992px) 100vw 33vw"
                        alt={`image ${block.imageTitle}`}
                        className={styles.block__img}
                        blurDataURL={blurBase64}
                        placeholder="blur"
                      />
                    </div>
                    <figcaption className={styles.figcaption}>{block.imageTitle}</figcaption>
                  </figure>
                )}
              </article>
            ))}
          </div>

          <TitleAndLine hSize={2} title={`Карта и профиль высоты маршрута ${trail.title}`} />

          <div className={styles.box__map}>
            <MapWithElevation url={trail.trackGPX} />
          </div>

          <TrailTotal trail={trail} />

          {/* Блок погоды */}
          {trail.trackGPX && (
            <div className={styles.box__weather}>
              <Weather urlTrack={trail.trackGPX} startLocation={trail.startLocation} />
            </div>
          )}

          {/* Интерактивный блок. */}
          <div className={styles.interactive}>
            <InteractiveBlock
              likesCount={trail.count.likes}
              isLikedByUser={trail.isLikedByUser}
              viewsCount={trail.count.views}
              idDocument={trail._id}
              commentsCount={comments.length}
              target="trail"
            />
          </div>
          <hr className={styles.line} />
          <BlockShare title={'Поделиться'} />
          <hr className={styles.line} />

          {/* Блок комментариев */}
          <div className={styles.block__comments}>
            <BlockComments
              comments={comments}
              authorId={trail.author.id}
              userId={session?.user.id ? +session?.user.id : null}
              document={{ _id: trail._id, type: 'trail' }}
              idUserDB={idUserDB}
            />
          </div>
        </div>
      </Wrapper>
    </>
  );
}
