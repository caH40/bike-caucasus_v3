'use client';

import Image from 'next/image';
import { Tooltip } from 'react-tooltip';
import cn from 'classnames/bind';

import styles from './Weather.module.css';

const cx = cn.bind(styles);

type Props = {
  icon: string;
  id: number;
  description: string;
  width?: number;
  height?: number;
};

const getLinkIcon = (iconName: string) =>
  `https://openweathermap.org/img/wn/${iconName}@2x.png`;

export default function ClientBlockIcon({
  icon,
  id,
  description,
  width = 60,
  height = 60,
}: Props) {
  return (
    <div className={styles.box__icon}>
      <Image
        src={getLinkIcon(icon)}
        id={`icon_${id}`}
        width={width}
        height={height}
        alt="weather"
        className={styles.icon}
      />

      <Tooltip anchorSelect={`#icon_${id}`} place="top" className={cx('tooltip')}>
        {description}
      </Tooltip>
    </div>
  );
}
