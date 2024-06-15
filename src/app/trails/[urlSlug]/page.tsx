import { type Metadata } from 'next';
import Image from 'next/image';
import cn from 'classnames/bind';
import { notFound } from 'next/navigation';

import Wrapper from '@/components/Wrapper/Wrapper';
import { regions } from '@/constants/trail';
import BlockShare from '@/components/BlockShare/BlockShare';
import LineSeparator from '@/components/LineSeparator/LineSeparator';
import TrailTotal from '@/components/TrailTotal/TrailTotal';
import { getTrail } from '@/actions/trail';
import { generateMetadataTrail } from '@/meta/meta';
import { blurBase64 } from '@/libs/image';
import { Trail } from '@/services/Trail';
import styles from './TrailPage.module.css';

const cx = cn.bind(styles);

// Создание динамических meta данных
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataTrail(props);
}

type Props = {
  params: {
    urlSlug: string;
  };
};

export default async function TrailPage({ params }: Props) {
  const trail = await getTrail(params.urlSlug);

  // если нет Маршрута (или возникла ошибка на сервере) показывается страница 404.
  if (!trail) {
    notFound();
  }

  // Подсчет просмотров Маршрута.
  const trailService = new Trail();
  await trailService.countView(params.urlSlug);

  const trackGConnectId = trail.garminConnect?.split('/').at(-1);
  const trackKomootId = trail.komoot?.split('/').at(-1);

  return (
    <Wrapper
      title={`${trail.title} - велосипедный маршрут в регионе ${
        regions.find((region) => region.name === trail.region)?.translation || ''
      }`}
    >
      <div className={styles.main}>
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
              <div
                className={cx('block__text', { full: !block.image })}
                dangerouslySetInnerHTML={{ __html: block.text }}
              />

              {block.image && (
                <div className={styles.column__img}>
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
                  <h4 className={styles.img__title}>{block.imageTitle}</h4>
                </div>
              )}
            </article>
          ))}
        </div>

        {trackKomootId ? (
          <iframe
            src={`https://www.komoot.com/tour/${trackKomootId}/embed?share_token=aF9xgz5VStLwQYo3CvhKR7u2jBIobjQs1V2aVbqODPWgn1vQ5N&profile=1`}
            className={styles.komoot}
          ></iframe>
        ) : (
          trackGConnectId && (
            <iframe
              src={`https://connect.garmin.com/modern/course/embed/${trackGConnectId}`}
              className={styles.gconnect}
            />
          )
        )}

        <TrailTotal trail={trail} />
        <LineSeparator />
        <BlockShare title={'Поделиться'} />
      </div>
    </Wrapper>
  );
}
