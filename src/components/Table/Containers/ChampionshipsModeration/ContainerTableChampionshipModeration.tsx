'use client';

import { TDtoChampionship } from '@/types/dto.types';
import TableChampionship from '../../TableChampionship/TableChampionship';
// import styles from './ContainerTableChampionshipModeration.module.css';

type Props = {
  championships: TDtoChampionship[];
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTableChampionshipModeration({ championships }: Props) {
  return (
    <>
      {/* Таблица */}
      <TableChampionship championships={championships} docsOnPage={10} />
    </>
  );
}
