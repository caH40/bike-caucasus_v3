'use client';

import cn from 'classnames/bind';

import { getNavLinksTrailPopup } from '@/constants/navigation';
import MenuControl from './MenuControl';
import { Tooltip } from 'react-tooltip';
import styles from './MenuControl.module.css';

const cx = cn.bind(styles);

type Props = {
  trailUrlSlug: string; // urlSlug Маршрута.
};

/**
 * Формирование Popup меню с данными для Маршрута.
 */
export default function MenuForTrail({ trailUrlSlug }: Props) {
  return (
    <div className={styles.inner}>
      <MenuControl buttons={getNavLinksTrailPopup(trailUrlSlug)} />
      <Tooltip anchorSelect={'#popup-control-menu-trail'} place="top" className={cx('tooltip')}>
        Управление маршрутом
      </Tooltip>
    </div>
  );
}
