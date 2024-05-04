import Image from 'next/image';
import cn from 'classnames';

import styles from './Button.module.css';

type Props = {
  name: string;
  getClick: () => void;
  iconSrc?: string;
  alt?: string;
  size?: number;
  disabled?: boolean;
};

export default function Button({ getClick, name, alt, iconSrc, size = 24, disabled }: Props) {
  return (
    <button
      className={cn(styles.btn, { [styles.without__icon]: !iconSrc })}
      onClick={getClick}
      disabled={disabled}
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
