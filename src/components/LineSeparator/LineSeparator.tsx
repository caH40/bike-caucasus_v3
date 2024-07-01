import cn from 'classnames/bind';

import styles from './LineSeparator.module.css';

type Props = {
  theme?: string;
  marginBottom?: boolean;
  marginTop?: boolean;
};

const cx = cn.bind(styles);

/**
 * Разграничительная горизонтальная линия.
 */
export default function LineSeparator({ theme = 'white', marginBottom, marginTop }: Props) {
  return (
    <hr
      className={cx('line', { [theme]: theme })}
      style={{ marginBottom: marginBottom ? '1rem' : 0, marginTop: marginTop ? '1rem' : 0 }}
    />
  );
}
