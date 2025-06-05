'use client';

import { TGeneralClassificationDto } from '@/types/dto.types';
import TableGeneralClassification from '../../TableGeneralClassification/TableGeneralClassification';
import { TCategoriesEntity, TStagesForGCTableHeader } from '@/types/index.interface';

type Props = {
  generalClassification: TGeneralClassificationDto[];
  captionTitle: string; // Название таблицы.
  hiddenColumnHeaders: string[]; // Массив названий столбцов, которых необходимо скрыть.
  stages: TStagesForGCTableHeader[];
  categoryEntity: TCategoriesEntity;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerForGeneralClassification({
  generalClassification,
  hiddenColumnHeaders,
  captionTitle,
  stages,
  categoryEntity,
}: Props) {
  return (
    <>
      {/* Таблица */}
      <TableGeneralClassification
        generalClassification={generalClassification}
        captionTitle={captionTitle}
        stages={stages}
        hiddenColumnHeaders={hiddenColumnHeaders}
        categoryEntity={categoryEntity}
      />
    </>
  );
}
