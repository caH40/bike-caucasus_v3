'use client';

import cn from 'classnames/bind';

import { getNavLinksNewsPopup } from '@/constants/navigation';
import MenuControl from './MenuControl';
import { Tooltip } from 'react-tooltip';
import styles from './MenuControl.module.css';

const cx = cn.bind(styles);

type Props = {
  newsUrlSlug: string; // urlSlug новости.
};

/**
 * Формирование Popup меню с данными для новости.
 */
export default function MenuForNews({ newsUrlSlug }: Props) {
  return (
    <div className={styles.inner}>
      <MenuControl buttons={getNavLinksNewsPopup(newsUrlSlug)} />
      <Tooltip anchorSelect={'#popup-control-menu-news'} place="top" className={cx('tooltip')}>
        Управление новостью
      </Tooltip>
    </div>
  );
}
