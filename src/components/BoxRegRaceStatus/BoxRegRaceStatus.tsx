import cn from 'classnames/bind';

import { registrationStatusMap } from '@/constants/championship';
import { TRaceRegistrationStatus } from '@/types/models.interface';
import styles from './BoxRegRaceStatus.module.css';

const cx = cn.bind(styles);

type Props = {
  status: TRaceRegistrationStatus;
};

/**
 * Блок отображения статуса регистрации в таблице.
 */
export default function BoxRegRaceStatus({ status }: Props) {
  return (
    <div className={cx('wrapper', { [status]: status })}>
      {registrationStatusMap.get(status)?.translation}
    </div>
  );
}
