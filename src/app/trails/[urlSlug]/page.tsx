import Image from 'next/image';
import cn from 'classnames/bind';

import Wrapper from '@/components/Wrapper/Wrapper';
import { Trail } from '@/services/Trail';
import { errorLogger } from '@/errors/error';
import { regions } from '@/constants/trail';
import BlockShare from '@/components/BlockShare/BlockShare';
import LineSeparator from '@/components/LineSeparator/LineSeparator';
import TrailTotal from '@/components/TrailTotal/TrailTotal';
import type { TTrailDto } from '@/types/dto.types';
import styles from './TrailPage.module.css';

const cx = cn.bind(styles);

type Props = {
  params: {
    urlSlug: string;
  };
};
/**
 * Получение данных маршрута с БД.
 */
async function getTrail(urlSlug: string): Promise<TTrailDto | null | undefined> {
  try {
    const trailsService = new Trail();
    const response = await trailsService.getOne(urlSlug);

    if (!response.ok) {
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    errorLogger(error);
  }
}

export default async function TrailPage({ params }: Props) {
  const trail = await getTrail(params.urlSlug);

  return (
    <>
      {trail && (
        <Wrapper
          title={`Велосипедный маршрут  ${trail.title} по региону ${
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
              />
            </div>
            <div className={styles.context}>
              {trail.blocks.map((block) => (
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
      )}
    </>
  );
}
