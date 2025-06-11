'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import MenuControl from './MenuControl';
import type { TClientMeta, TMenuOnPage } from '@/types/index.interface';

import styles from './MenuControl.module.css';
import { useLocationInfo } from '@/hooks/useLocationInfo';
import { useDeviceInfo } from '@/hooks/useDeviceInfo';

const cx = cn.bind(styles);

type Props = {
  urlSlug: string; // urlSlug модерируемой страницы.
  getMenuItems: ({
    urlSlug,
    client,
    hiddenItemNames,
  }: {
    urlSlug: string;
    client: TClientMeta;
    hiddenItemNames: string[];
  }) => TMenuOnPage[]; // eslint-disable-line no-unused-vars
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
  // Мета данные по client.
  const location = useLocationInfo();
  const deviceInfo = useDeviceInfo();

  return (
    <div className={styles.inner}>
      <MenuControl
        buttons={getMenuItems({ urlSlug, hiddenItemNames, client: { location, deviceInfo } })}
      />
      <Tooltip anchorSelect={id} place="top" className={cx('tooltip')}>
        {messageTooltip}
      </Tooltip>
    </div>
  );
}
