'use client';

import {
  TAwardedProtocols,
  TGetOneGeneralClassificationService,
} from '@/types/index.interface';
import ContainerForGeneralClassification from '../Table/Containers/GeneralClassification/ContainerForGeneralClassification';
import styles from './GeneralClassificationWrapper.module.css';
import { replaceCategorySymbols } from '@/libs/utils/championship/championship';

type Props = {
  gcFromServer: TGetOneGeneralClassificationService;
  awardedProtocols: TAwardedProtocols;
};

/**
 * Обертка для клиентских компонентов страницы генеральная классификация Чемпионата (Серии и Тура).
 */
export default function GeneralClassificationWrapper({
  gcFromServer,
  awardedProtocols,
}: Props) {
  return (
    // Таблица ГК по абсолютному протоколу.
    <div className={styles.wrapper}>
      {awardedProtocols.category
        ? gcFromServer.existCategoryNames.age.map((category) => (
            <ContainerForGeneralClassification
              key={category}
              generalClassification={gcFromServer.generalClassification
                .toSorted((a, b) => {
                  const aCategory = a.totalFinishPoints?.category || 0;
                  const bCategory = b.totalFinishPoints?.category || 0;
                  return bCategory - aCategory;
                })
                .filter((gc) => gc.categoryAge === category)}
              stages={gcFromServer.stages}
              hiddenColumnHeaders={['#']}
              captionTitle={`Генеральная классификация в категории ${replaceCategorySymbols(
                category
              )}`}
              categoryEntity={'category'}
            />
          ))
        : null}

      {awardedProtocols.category
        ? gcFromServer.existCategoryNames.skillLevel.map((category) => (
            <ContainerForGeneralClassification
              key={category}
              generalClassification={gcFromServer.generalClassification
                .toSorted((a, b) => {
                  const aCategory = a.totalFinishPoints?.category || 0;
                  const bCategory = b.totalFinishPoints?.category || 0;
                  return bCategory - aCategory;
                })
                .filter((gc) => gc.categoryAge === category)}
              stages={gcFromServer.stages}
              hiddenColumnHeaders={['#']}
              captionTitle={`Генеральная классификация в категории ${replaceCategorySymbols(
                category
              )}`}
              categoryEntity={'category'}
            />
          ))
        : null}

      {awardedProtocols.absolute && (
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
      )}
    </div>
  );
}
