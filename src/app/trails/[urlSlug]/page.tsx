import { type Metadata } from 'next';
import Image from 'next/image';
import cn from 'classnames/bind';

import Wrapper from '@/components/Wrapper/Wrapper';
import { regions } from '@/constants/trail';
import BlockShare from '@/components/BlockShare/BlockShare';
import LineSeparator from '@/components/LineSeparator/LineSeparator';
import TrailTotal from '@/components/TrailTotal/TrailTotal';
import { getTrail } from '@/actions/trail';
import { generateMetadataTrail } from '@/meta/meta';

import styles from './TrailPage.module.css';
import { notFound } from 'next/navigation';
import { blurBase64 } from '@/libs/image';

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

          <TrailTotal trail={trail} />
        </div>
        <LineSeparator />
        <BlockShare title={'Поделиться'} />
      </div>
    </Wrapper>
  );
}
