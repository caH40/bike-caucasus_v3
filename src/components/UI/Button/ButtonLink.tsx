import Image from 'next/image';
import cn from 'classnames/bind';

import styles from './Button.module.css';
import Link from 'next/link';

const cx = cn.bind(styles);

type Props = {
  href: string;
  name: string;
  iconSrc?: string;
  alt?: string;
  size?: number;
  theme?: string;
  loading?: boolean;
  disabled?: boolean;
};

/**
 * Общая кнопка для Link
 * изменение стилизация с помощью пропса theme, существуют: green
 * может передаваться Icon, как Image, квадратная форма размер по умолчанию 24х24px
 */
export default function ButtonLink({
  href,
  name,
  alt,
  iconSrc,
  size = 24,
  theme,
  loading,
  disabled,
}: Props) {
  return (
    <Link
      className={cx('btn', {
        ['without__icon']: !iconSrc,
        [theme as string]: theme,
        loading,
        'disabled-link': disabled,
      })}
      href={href}
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
      {name}
    </Link>
  );
}
