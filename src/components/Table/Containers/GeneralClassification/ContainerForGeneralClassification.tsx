'use client';

import { TGeneralClassificationDto } from '@/types/dto.types';
import TableGeneralClassification from '../../TableGeneralClassification/TableGeneralClassification';

type Props = {
  generalClassification: TGeneralClassificationDto[];
  captionTitle: string; // Название таблицы.
  hiddenColumnHeaders: string[]; // Массив названий столбцов, которых необходимо скрыть.
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerForGeneralClassification({
  generalClassification,
  hiddenColumnHeaders,
  captionTitle,
}: Props) {
  return (
    <>
      {/* Таблица */}
      <TableGeneralClassification
        generalClassification={generalClassification}
        captionTitle={captionTitle}
        hiddenColumnHeaders={hiddenColumnHeaders}
      />
    </>
  );
}
