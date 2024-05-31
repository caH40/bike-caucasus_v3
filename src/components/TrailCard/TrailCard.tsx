import Image from 'next/image';
import cn from 'classnames';

import styles from './TrailCard.module.css';
import { TTrailDto } from '@/types/dto.types';

type Props = {
  trail: TTrailDto;
};

export default function TrailCard({ trail }: Props) {
  return (
    <a
      href={String(trail._id)}
      className={cn(styles.card, { [styles.mtb]: trail.bikeType === 'Горный' })}
    >
      <Image
        width={308}
        height={184}
        className={styles.img}
        src={trail.cardPhoto}
        alt={`Poster ${trail.nameRoute}`}
      />
      <h2 className={styles.title}>{trail.nameRoute}</h2>
      <h3 className={`${styles.title} ${styles.title_sub}`}>{trail.state}</h3>
      <div className={styles.text}>
        <div className={styles.description}>
          <Image
            width={15}
            height={15}
            className={styles.ico}
            src="/images/icons/start-flag.svg"
            alt="start"
          />
          <span className={styles.names}>Старт:</span>
          <span className={styles.names_data}>{trail.start}</span>
        </div>
        <div className={styles.description}>
          <Image
            width={15}
            height={15}
            className={styles.ico}
            src="/images/icons/turn-arrow.svg"
            alt="turn"
          />
          <span className={styles.names}>Разворот:</span>
          <span className={styles.names_data}>{trail.turn}</span>
        </div>
        <div className={styles.description}>
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
        <div className={styles.description}>
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
        <div className={styles.description}>
          <Image
            width={15}
            height={15}
            className={styles.ico}
            src="/images/icons/finish-flag.svg"
            alt="finish"
          />
          <span className={styles.names}>Финиш:</span>
          <span className={styles.names_data}>{trail.finish}</span>
        </div>
        <div className={styles.description}>
          <Image
            width={15}
            height={15}
            className={styles.ico}
            src="/images/icons/bike.svg"
            alt="bike"
          />
          <span className={styles.names}>Тип:</span>
          <span className={styles.names_data}>{trail.bikeType}</span>
        </div>
      </div>

      <div className={styles.box__kudos}>
        <div>
          <Image width={23} height={13} src="/images/icons/kudos.svg" alt="kudos" />
          {/* <span className={styles.kudos__text}>{trail.likes ?? 0}</span> */}
        </div>

        <div>
          <Image width={23} height={13} src="/images/icons/eye.svg" alt="eye" />
          {/* <span className={styles.kudos__text}>{trail.kudoses?.views ?? 0}</span> */}
        </div>
      </div>
    </a>
  );
}
