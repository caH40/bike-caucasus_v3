'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import MenuControl from './MenuControl';
import type { TMenuOnPage } from '@/types/index.interface';

import styles from './MenuControl.module.css';

const cx = cn.bind(styles);

type Props = {
  urlSlug: string; // urlSlug модерируемой страницы.
  getMenuItems: (urlSlug: string, hiddenItemNames: string[]) => TMenuOnPage[]; // eslint-disable-line no-unused-vars
  id: string; // id элемента для подсказки tooltip, #уникальное_название.
  messageTooltip: string;
  hiddenItemNames?: string[];
};

/**
 * Формирование Popup меню с данными для Чемпионата.
 */
export default function MenuEllipsisControl({
  urlSlug,
  getMenuItems,
  id,
  messageTooltip,
  hiddenItemNames = [],
}: Props) {
  return (
    <div className={styles.inner}>
      <MenuControl buttons={getMenuItems(urlSlug, hiddenItemNames)} />
      <Tooltip anchorSelect={id} place="top" className={cx('tooltip')}>
        {messageTooltip}
      </Tooltip>
    </div>
  );
}
