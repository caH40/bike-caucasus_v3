'use client';

import {
  TAwardedProtocols,
  TGetOneGeneralClassificationService,
} from '@/types/index.interface';
import ContainerForGeneralClassification from '../Table/Containers/GeneralClassification/ContainerForGeneralClassification';
import styles from './GeneralClassificationWrapper.module.css';
import { replaceCategorySymbols } from '@/libs/utils/championship/championship';
import { useGeneralClassificationProtocol } from '@/hooks/useGeneralClassificationProtocol';

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
  // Отфильтрованные и отсортированные генеральные классификации.
  const {
    absoluteGC,
    absoluteMaleGC,
    absoluteFemaleGC,
    ageCategoryGCs,
    skillLevelCategoryGCs,
  } = useGeneralClassificationProtocol({
    generalClassification: gcFromServer.generalClassification,
    awardedProtocols,
    existCategoryNames: gcFromServer.existCategoryNames,
  });

  return (
    // Таблица ГК по абсолютному протоколу.
    <div className={styles.wrapper}>
      {/* Таблицы ГК по возрастным категориям. */}
      {awardedProtocols.category
        ? ageCategoryGCs.map((ageCategoryGC, index) => (
            <ContainerForGeneralClassification
              key={index}
              generalClassification={ageCategoryGC}
              stages={gcFromServer.stages}
              hiddenColumnHeaders={['#']}
              captionTitle={`Генеральная классификация в категории ${replaceCategorySymbols(
                ageCategoryGC[0].categoryAge || '"Нет категории!"'
              )}`}
              categoryEntity={'category'}
            />
          ))
        : null}

      {/* Таблицы ГК по спецкатегориям. */}
      {awardedProtocols.category
        ? skillLevelCategoryGCs.map((skillLevelCategoryGC, index) => (
            <ContainerForGeneralClassification
              key={index}
              generalClassification={skillLevelCategoryGC}
              stages={gcFromServer.stages}
              hiddenColumnHeaders={['#']}
              captionTitle={`Генеральная классификация в категории ${replaceCategorySymbols(
                skillLevelCategoryGC[0].categorySkillLevel || '"Нет категории!"'
              )}`}
              categoryEntity={'category'}
            />
          ))
        : null}

      {/* Таблица ГК по абсолютному протоколу. */}
      {awardedProtocols.absolute && (
        <ContainerForGeneralClassification
          generalClassification={absoluteGC}
          stages={gcFromServer.stages}
          hiddenColumnHeaders={['#']}
          captionTitle={'Генеральная классификация в абсолюте'}
          categoryEntity={'absolute'}
        />
      )}

      {/* Таблицы ГК по абсолютным женским и мужским протоколам. */}
      {awardedProtocols.absoluteGender
        ? [absoluteMaleGC, absoluteFemaleGC]
            .filter((gc) => gc.length > 0)
            .map((absoluteGenderGC, index) => (
              <ContainerForGeneralClassification
                key={index}
                generalClassification={absoluteGenderGC}
                stages={gcFromServer.stages}
                hiddenColumnHeaders={['#']}
                captionTitle={`Генеральная классификация в ${
                  absoluteGenderGC[0]?.profile.gender === 'male' ? 'мужском' : 'женском'
                } абсолюте`}
                categoryEntity={'absoluteGender'}
              />
            ))
        : null}
    </div>
  );
}
