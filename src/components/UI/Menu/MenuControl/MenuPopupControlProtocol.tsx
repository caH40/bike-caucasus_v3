'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';
import { toast } from 'sonner';

import MenuControl from './MenuControl';
import styles from './MenuControl.module.css';
import PermissionCheck from '@/hoc/permission-check';
import IconEditOld from '@/components/Icons/IconEditOld';
import { updateProtocolRace } from '@/actions/result-race';
import { useResultsRace } from '@/store/results';
import IconRefresh from '@/components/Icons/IconRefresh';

const cx = cn.bind(styles);

type Props = {
  raceInfo: { championshipUrlSlug: string; raceNumber: number };
};

// Роли для использования меню.
const permission = 'admin';

/**
 * Popup меню управления протоколом заезда в таблице результатов.
 */
export default function MenuPopupControlProtocol({ raceInfo }: Props) {
  const setTriggerResultTable = useResultsRace((state) => state.setTriggerResultTable);
  const handlerUpdateProtocolRace = async (championshipId: string, raceNumber: number) => {
    if (!championshipId || !raceNumber) {
      return toast.error('Нет данных об Чемпионате, или в протоколе нет ни одного результата!');
    }

    const response = await updateProtocolRace({
      championshipId,
      raceNumber,
    });

    if (response.ok) {
      toast.success(response.message);
      setTriggerResultTable();
    } else {
      toast.error(response.message);
    }
  };

  // Пункты в меню.
  const buttons = [
    {
      id: 0,
      name: 'Редактирование',
      href: `/moderation/championship/protocol/${raceInfo.championshipUrlSlug}/${raceInfo.raceNumber}`,
      permission,
      icon: IconEditOld,
      classes: [],
    },
    {
      id: 1,
      name: 'Обновление',
      onClick: () =>
        handlerUpdateProtocolRace(raceInfo.championshipUrlSlug, raceInfo.raceNumber),
      permission,
      icon: IconRefresh,
      classes: [],
    },
  ];
  return (
    <PermissionCheck permission={permission}>
      <div className={styles.inner}>
        <MenuControl buttons={buttons} />
        <Tooltip
          anchorSelect={'protocol-MenuPopupControlProtocol'}
          place="top"
          className={cx('tooltip')}
        >
          {'Обновить данные протокола: позиции, категории, отставания, ср.скорость'}
        </Tooltip>
      </div>
    </PermissionCheck>
  );
}
