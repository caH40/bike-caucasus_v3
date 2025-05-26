import cn from 'classnames/bind';
import styles from './BlockStartNumber.module.css';

const cx = cn.bind(styles);

type Props = {
  startNumber: number | null;
  gender: 'male' | 'female';
};

/**
 * Блок отображения стартового номера райдера.
 */
export default function BlockStartNumber({ startNumber, gender }: Props) {
  return (
    <div className={cx('numbers', { female: gender === 'female' })}>
      {startNumber ? startNumber : 'n/a'}
    </div>
  );
}
