'use client';

import cn from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { Tooltip } from 'react-tooltip';
import { toast } from 'sonner';

import MenuControl from './MenuControl';
import styles from './MenuControl.module.css';

import IconEditOld from '@/components/Icons/IconEditOld';
import { updateProtocolRace } from '@/actions/result-race';
import IconRefresh from '@/components/Icons/IconRefresh';

const cx = cn.bind(styles);

type Props = {
  raceInfo: { championshipId: string; championshipUrlSlug: string; raceId: string };
  permission: string;
};

/**
 * Popup меню управления протоколом заезда в таблице результатов.
 */
export default function ProtocolMenuPopup({ raceInfo, permission }: Props) {
  const router = useRouter();

  const handlerUpdateProtocolRace = async (championshipId: string, raceId: string) => {
    if (!championshipId || !raceId) {
      return toast.error('Нет данных об Чемпионате, или в протоколе нет ни одного результата!');
    }

    const response = await updateProtocolRace({
      championshipId,
      raceId,
    });

    if (response.ok) {
      toast.success(response.message);
      router.refresh();
    } else {
      toast.error(response.message);
    }
  };

  // Пункты в меню.
  const buttons = [
    {
      id: 0,
      name: 'Добавление',
      href: `/moderation/championship/protocol/${raceInfo.championshipUrlSlug}/${raceInfo.raceId}`,
      permission,
      icon: IconEditOld,
      classes: [],
    },
    {
      id: 1,
      name: 'Обновление',
      onClick: () => handlerUpdateProtocolRace(raceInfo.championshipId, raceInfo.raceId),
      permission,
      icon: IconRefresh,
      classes: [],
    },
  ];

  return (
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
  );
}
