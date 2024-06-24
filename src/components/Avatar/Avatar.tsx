import Image from 'next/image';

import { getLogoProfile } from '@/libs/utils/profile';
import styles from './Avatar.module.css';
import type { TAuthor } from '@/types/dto.types';

type Props = {
  squareSize?: number;
  author: TAuthor;
};

/**
 * Аватар пользователя.
 */
export default function Avatar({ squareSize = 24, author }: Props) {
  return (
    <Image
      width={squareSize}
      height={squareSize}
      alt={`${author.person.lastName} ${author.person.firstName}`}
      src={getLogoProfile(author.imageFromProvider, author.provider?.image, author.image)}
      className={styles.img}
    />
  );
}
