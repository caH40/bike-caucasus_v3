import cn from 'classnames/bind';

import styles from './icons.module.css';

const cx = cn.bind(styles);

type Props = {
  squareSize?: number;
  isActive?: boolean; // нажатое состояние
  getClick?: () => void;
};

export default function Icon({ isActive, squareSize = 24, getClick }: Props) {
  return (
    <div
      onClick={getClick}
      className={cx('box', {
        interactive: getClick,
        active: isActive,
      })}
      style={{ width: squareSize, height: squareSize }}
    ></div>
  );
}
