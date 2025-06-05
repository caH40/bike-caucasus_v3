'use client';

import ContainerForGeneralClassification from '../Table/Containers/GeneralClassification/ContainerForGeneralClassification';
import styles from './GeneralClassificationWrapper.module.css';

// types
import type { TDtoChampionship, TGeneralClassificationDto } from '@/types/dto.types';

type Props = {
  championship: TDtoChampionship;
  generalClassification: TGeneralClassificationDto[];
};

/**
 * Обертка для клиентских компонентов страницы генеральная классификация Чемпионата (Серии и Тура).
 */
export default function GeneralClassificationWrapper({
  championship,
  generalClassification,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <ContainerForGeneralClassification
        generalClassification={generalClassification.toSorted(
          (a, b) => b.totalFinishPoints?.absolute - a.totalFinishPoints?.absolute
        )}
        hiddenColumnHeaders={['#']}
        captionTitle={'Генеральная классификация в абсолюте'}
      />
    </div>
  );
}
