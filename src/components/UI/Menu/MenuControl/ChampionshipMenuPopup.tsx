'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import MenuControl from './MenuControl';
import styles from './MenuControl.module.css';
import PermissionCheck from '@/hoc/permission-check';

import { getNavLinksChampionshipPopup } from '@/constants/navigation';

const cx = cn.bind(styles);

type Props = {
  urlSlug: string;
  raceId: string;
  hiddenItemNames: string[];
};

// Роли для использования меню.
const permission = 'moderation.championship.protocol';

/**
 * Popup меню управления протоколом заезда в таблице результатов.
 */
export default function ChampionshipMenuPopup({ urlSlug, raceId, hiddenItemNames }: Props) {
  return (
    <PermissionCheck permission={permission}>
      <div className={styles.inner}>
        <MenuControl buttons={getNavLinksChampionshipPopup(urlSlug, raceId, hiddenItemNames)} />
        <Tooltip
          anchorSelect={'popup-control-menu-championship'}
          place="top"
          className={cx('tooltip')}
        >
          {'Управление Чемпионатом'}
        </Tooltip>
      </div>
    </PermissionCheck>
  );
}
