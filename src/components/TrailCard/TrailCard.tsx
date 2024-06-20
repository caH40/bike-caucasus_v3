import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames/bind';

import IconEye from '../Icons/IconEye';
import IconHandThumbUp from '../Icons/IconHandThumbUp';
import { bikeTypes, regions } from '@/constants/trail';
import type { TTrailDto } from '@/types/dto.types';
import styles from './TrailCard.module.css';
import { blurBase64 } from '@/libs/image';

type Props = {
  trail: TTrailDto;
};

const cx = cn.bind(styles);

export default function TrailCard({ trail }: Props) {
  return (
    <Link
      href={`/trails/${trail.urlSlug}`}
      className={cx('card', { mtb: trail.bikeType === 'mtb' })}
    >
      <div className={styles.box__img}>
        <Image
          fill={true}
          sizes="310px"
          className={styles.img}
          src={trail.poster}
          alt={`Poster ${trail.title}`}
          placeholder="blur"
          blurDataURL={blurBase64}
        />
      </div>
      <div className={styles.description}>
        <div className={styles.block__title}>
          <h2 className={styles.title}>{trail.title}</h2>
          <h3 className={cx('title', 'title_sub')}>
            {regions.find((region) => region.name === trail.region)?.translation || 'не задан'}
          </h3>
        </div>

        <div className={styles.content}>
          <div className={styles.item}>
            <Image
              width={15}
              height={15}
              className={styles.ico}
              src="/images/icons/start-flag.svg"
              alt="start"
            />
            <span className={styles.names}>Старт:</span>
            <span className={styles.names_data}>{trail.startLocation}</span>
          </div>

          <div className={styles.item}>
            <Image
              width={15}
              height={15}
              className={styles.ico}
              src="/images/icons/turn-arrow.svg"
              alt="turn"
            />
            <span className={styles.names}>Разворот:</span>
            <span className={styles.names_data}>{trail.turnLocation}</span>
          </div>

          <div className={styles.item}>
            <Image
              width={15}
              height={15}
              className={styles.ico}
              src="/images/icons/route-line.svg"
              alt="route"
            />
            <span className={styles.names}>Дистанция:</span>
            <span className={styles.names_data}>{trail.distance}км</span>
          </div>

          <div className={styles.item}>
            <Image
              width={15}
              height={15}
              className={styles.ico}
              src="/images/icons/mountain.svg"
              alt="ascent"
            />
            <span className={styles.names}>Набор высоты:</span>
            <span className={styles.names_data}>{trail.ascent}м</span>
          </div>

          <div className={styles.item}>
            <Image
              width={15}
              height={15}
              className={styles.ico}
              src="/images/icons/finish-flag.svg"
              alt="finish"
            />
            <span className={styles.names}>Финиш:</span>
            <span className={styles.names_data}>{trail.finishLocation}</span>
          </div>

          <div className={styles.item}>
            <Image
              width={15}
              height={15}
              className={styles.ico}
              src="/images/icons/bike.svg"
              alt="bike"
            />
            <span className={styles.names}>Тип:</span>
            <span className={styles.names_data}>
              {bikeTypes.find((bt) => bt.name === trail.bikeType)?.translation || 'не задан'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.box__kudos}>
        <div>
          <IconHandThumbUp
            squareSize={20}
            isActive={trail.isLikedByUser}
            colors={{ active: '#fafafa80' }}
          />
          <span className={styles.kudos__text}>{trail.count.likes ?? 0}</span>
        </div>

        <div>
          <IconEye squareSize={20} />
          <span className={styles.kudos__text}>{trail.count.views ?? 0}</span>
        </div>
      </div>
    </Link>
  );
}
