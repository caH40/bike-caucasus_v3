import cn from 'classnames/bind';

import styles from './LineSeparator.module.css';

type Props = {
  theme?: string;
};

const cx = cn.bind(styles);

/**
 * Разграничительная горизонтальная линия.
 */
export default function LineSeparator({ theme = 'white' }: Props) {
  return <hr className={cx('line', { [theme]: theme })} />;
}
