'use client';

import { TGetOneGeneralClassificationService } from '@/types/index.interface';
import ContainerForGeneralClassification from '../Table/Containers/GeneralClassification/ContainerForGeneralClassification';
import styles from './GeneralClassificationWrapper.module.css';

type Props = {
  gcFromServer: TGetOneGeneralClassificationService;
};

/**
 * Обертка для клиентских компонентов страницы генеральная классификация Чемпионата (Серии и Тура).
 */
export default function GeneralClassificationWrapper({ gcFromServer }: Props) {
  return (
    // Таблица ГК по абсолютному протоколу.
    <div className={styles.wrapper}>
      <ContainerForGeneralClassification
        generalClassification={gcFromServer.generalClassification.toSorted((a, b) => {
          const aAbsolute = a.totalFinishPoints?.absolute || 0;
          const bAbsolute = b.totalFinishPoints?.absolute || 0;
          return bAbsolute - aAbsolute;
        })}
        stages={gcFromServer.stages}
        hiddenColumnHeaders={['#']}
        captionTitle={'Генеральная классификация в абсолюте'}
        categoryEntity={'absolute'}
      />
    </div>
  );
}
