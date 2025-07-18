'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import MenuControl from './MenuControl';
import { getNavLinksChampionshipPopup } from '@/constants/navigation';
import { useLocationInfo } from '@/hooks/useLocationInfo';
import { useDeviceInfo } from '@/hooks/useDeviceInfo';
import styles from './MenuControl.module.css';

const cx = cn.bind(styles);

type Props = {
  urlSlug: string;
  championshipId: string;
  raceId: string;
  hiddenItemNames: string[];
};

/**
 * Popup меню управления протоколом заезда в таблице результатов.
 */
export default function ChampionshipMenuPopup({
  urlSlug,
  raceId,
  hiddenItemNames,
  championshipId,
}: Props) {
  // Мета данные по client.
  const location = useLocationInfo();
  const deviceInfo = useDeviceInfo();

  return (
    <div className={styles.inner}>
      <MenuControl
        buttons={getNavLinksChampionshipPopup(
          urlSlug,
          raceId,
          championshipId,
          { location, deviceInfo },
          hiddenItemNames
        )}
      />
      <Tooltip
        anchorSelect={'popup-control-menu-championship'}
        place="top"
        className={cx('tooltip')}
      >
        {'Управление Чемпионатом'}
      </Tooltip>
    </div>
  );
}
