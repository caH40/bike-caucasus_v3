'use client';

import cn from 'classnames/bind';

import { TRaceRegistrationStatus } from '@/types/models.interface';
import styles from './BlockRegRaceStatus.module.css';
import BoxRegRaceStatus from '../BoxRegRaceStatus/BoxRegRaceStatus';
import IconDelete from '../Icons/IconDelete';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const cx = cn.bind(styles);

type Props = {
  status: TRaceRegistrationStatus;
  userIdDb: string | undefined;
};

/**
 * Блок отображения статуса регистрации в таблице.
 */
export default function BlockRegRaceStatus({ status, userIdDb }: Props) {
  const { data: session } = useSession();
  const idDB = session?.user.idDB;
  const isCurrentUser = userIdDb === idDB;

  const handlerClick = () => {
    const isConfirmed = window.confirm('Отменить регистрацию в Заезде?');

    if (!isConfirmed) {
      return toast.warning('Отмена аннулирования регистрации.');
    }

    console.log('действия по аннулированию регистрации в Заезде');
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
