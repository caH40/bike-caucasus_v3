'use client';

import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import cn from 'classnames/bind';

import { TRaceRegistrationStatus } from '@/types/models.interface';
import styles from './BlockRegRaceStatus.module.css';
import BoxRegRaceStatus from '../BoxRegRaceStatus/BoxRegRaceStatus';
import IconDelete from '../Icons/IconDelete';
import { putRegistrationRiderChamp } from '@/actions/championship';
import { useLoadingStore } from '@/store/loading';

const cx = cn.bind(styles);

type Props = {
  status: TRaceRegistrationStatus;
  userIdDb: string | undefined;
  championshipId: string;
  raceNumber: number;
};

/**
 * Блок отображения статуса регистрации в таблице.
 */
export default function BlockRegRaceStatus({
  status,
  userIdDb,
  championshipId,
  raceNumber,
}: Props) {
  const setLoading = useLoadingStore((state) => state.setLoading);

  const { data: session } = useSession();
  const idDB = session?.user.idDB;
  const isCurrentUser = userIdDb === idDB;

  const handlerClick = async () => {
    if (!idDB) {
      return;
    }

    const isConfirmed = window.confirm('Отменить регистрацию в Заезде?');

    if (!isConfirmed) {
      return toast.warning('Отмена аннулирования регистрации.');
    }

    setLoading(true);

    const res = await putRegistrationRiderChamp({
      championshipId,
      raceNumber,
      updates: { status: 'canceled' },
      riderId: idDB,
    });

    if (res.ok) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    setLoading(false);
  };

  return (
    <div className={cx('wrapper')}>
      <BoxRegRaceStatus status={status} />
      {idDB && status === 'registered' && isCurrentUser && (
        <IconDelete
          squareSize={18}
          colors={{ default: 'red', hover: 'orange' }}
          tooltip="Отмена регистрации"
          getClick={handlerClick}
        />
      )}
    </div>
  );
}
