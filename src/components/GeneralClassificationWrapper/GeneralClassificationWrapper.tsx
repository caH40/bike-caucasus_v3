'use client';

import styles from './GeneralClassificationWrapper.module.css';

// types
import type { TDtoChampionship } from '@/types/dto.types';

type Props = {
  championship: TDtoChampionship;
};

/**
 * Обертка для клиентских компонентов страницы генеральная классификация Чемпионата (Серии и Тура).
 */
export default function GeneralClassificationWrapper({ championship }: Props) {
  return <div className={styles.wrapper}></div>;
}
