import { createElement } from 'react';
import cn from 'classnames/bind';

import styles from './TitleAndLine.module.css';
import LineSeparator from '../LineSeparator/LineSeparator';
import { TIconProps } from '@/types/index.interface';

const cx = cn.bind(styles);

type Props = {
  title: string;
  hSize?: 1 | 2 | 3 | 4 | 5 | 6;
  Icon?: React.ComponentType<TIconProps>;
  hideLine?: boolean;
};

/**
 * Компонент, отображающий заголовок указанного уровня и горизонтальную линию.
 * @param {Object} props - Объект с параметрами.
 * @param {string} props.title - Текст заголовка.
 * @param {1 | 2 | 3 | 4 | 5 | 6} props.hSize - Размер заголовка (h1, h2, h3, h4, h5, h6).
 * @returns {JSX.Element} - JSX элемент, содержащий заголовок и горизонтальную линию.
 */
export default function TitleAndLine({
  title,
  hSize = 1,
  Icon,
  hideLine = false,
}: Props): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box__title}>
        {Icon && (
          <div>
            <Icon squareSize={28} />
          </div>
        )}
        {createElement(`h${hSize}`, { className: cx('title', `h${hSize}`) }, title)}
      </div>
      {!hideLine && <LineSeparator marginBottom={true} />}
    </div>
  );
}
