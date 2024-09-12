import Image from 'next/image';
import cn from 'classnames/bind';

import styles from './Button.module.css';
import { MouseEvent } from 'react';

const cx = cn.bind(styles);

type Props = {
  name: string;
  // eslint-disable-next-line no-unused-vars
  getClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  iconSrc?: string;
  alt?: string;
  size?: number;
  disabled?: boolean;
  theme?: string;
  loading?: boolean;
  type?: 'submit' | 'reset' | 'button';
};

/**
 * Общая кнопка
 * изменение стилизация с помощью пропса theme, существуют: green
 * может передаваться Icon, как Image, квадратная форма размер по умолчанию 24х24px
 */
export default function Button({
  getClick,
  name,
  alt,
  iconSrc,
  size = 24,
  disabled,
  theme,
  loading,
  ...props
}: Props) {
  return (
    <button
      className={cx('btn', {
        ['without__icon']: !iconSrc,
        [theme as string]: theme,
        loading,
      })}
      onClick={getClick}
      disabled={disabled || loading}
      {...props}
    >
      {iconSrc && (
        <Image
          width={size}
          height={size}
          alt={alt ?? name}
          src={iconSrc}
          className={styles.img}
        />
      )}
      <span>{name}</span>
    </button>
  );
}
