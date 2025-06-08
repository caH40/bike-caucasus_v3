import { useMemo } from 'react';

// types
import { TGeneralClassificationDto } from '@/types/dto.types';
import { TAwardedProtocols, TCategoriesConfigNames } from '@/types/index.interface';

type Params = {
  generalClassification: TGeneralClassificationDto[];
  awardedProtocols: TAwardedProtocols;
  existCategoryNames: TCategoriesConfigNames;
};

/**
 * Хук возвращает отфильтрованные и отсортированные генеральные классификации,
 * соответствующие активным награждаемым протоколам.
 */
export function useGeneralClassificationProtocol({
  generalClassification,
  awardedProtocols,
  existCategoryNames,
}: Params) {
  return useMemo(() => {
    /**
     * Универсальная функция сортировки по типу очков.
     */
    const sortByPoints = (
      key: keyof NonNullable<TGeneralClassificationDto['totalFinishPoints']>
    ) => {
      return [...generalClassification].sort((a, b) => {
        const aPoints = a.totalFinishPoints?.[key] ?? 0;
        const bPoints = b.totalFinishPoints?.[key] ?? 0;
        return bPoints - aPoints;
      });
    };

    // Абсолютный ГК.
    const absoluteGC = awardedProtocols.absolute ? sortByPoints('absolute') : [];

    // Абсолютный ГК по полу.
    const absoluteGenderSorted = awardedProtocols.absoluteGender
      ? sortByPoints('absoluteGender')
      : [];

    const absoluteMaleGC = absoluteGenderSorted.filter((gc) => gc.profile.gender === 'male');

    const absoluteFemaleGC = absoluteGenderSorted.filter(
      (gc) => gc.profile.gender === 'female'
    );

    // ГК по возрастным категориям. Райдер в возрастной категории, если categorySkillLevel === null.
    const ageCategoryGCs: TGeneralClassificationDto[][] = awardedProtocols.category
      ? existCategoryNames.age.map((categoryName) =>
          sortByPoints('category').filter(
            (gc) => gc.categoryAge === categoryName && !gc.categorySkillLevel
          )
        )
      : [];

    // ГК по скилл-категориям.
    const skillLevelCategoryGCs: TGeneralClassificationDto[][] = awardedProtocols.category
      ? existCategoryNames.skillLevel.map((categoryName) =>
          sortByPoints('category').filter((gc) => gc.categorySkillLevel === categoryName)
        )
      : [];

    return {
      absoluteGC,
      absoluteMaleGC,
      absoluteFemaleGC,
      ageCategoryGCs,
      skillLevelCategoryGCs,
    };
  }, [generalClassification, awardedProtocols, existCategoryNames]);
}
