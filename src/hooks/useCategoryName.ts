import { DEFAULT_AGE_NAME_CATEGORY } from '@/constants/category';
import { createStringCategoryAge } from '@/libs/utils/string-category';
import { TGender, TRaceForForm } from '@/types/index.interface';
import { TCategories } from '@/types/models.interface';
import { useMemo } from 'react';

type Params = {
  categoryName: string;
  races: TRaceForForm[];
  categoriesConfigs: (Omit<TCategories, '_id' | 'championship'> & {
    _id: string;
  })[];
  profile: {
    yearBirthday: number | null;
    gender: TGender;
    ageCategory: string | null;
  };
  raceId: string;
};

type CategoryState = { age: string | null; skillLevel: string | null };

/**
 * Возвращает название возрастной или спецкатегории.
 */
export function useCategoryName({
  categoryName,
  races,
  categoriesConfigs,
  profile,
  raceId,
}: Params): { category: CategoryState } {
  const category = useMemo<CategoryState>(() => {
    // Значение, если категорию вычислить нельзя.
    const fallback: CategoryState = { age: profile.ageCategory, skillLevel: null };

    const categoriesIdInRace = races.find((r) => r._id === raceId)?.categories;
    const categories = categoriesConfigs.find((c) => c._id === categoriesIdInRace);

    if (!categoriesIdInRace || !categories || !profile.yearBirthday) {
      return fallback;
    }

    const ageCategoryName = createStringCategoryAge({
      yearBirthday: profile.yearBirthday,
      categoriesAge: profile.gender === 'female' ? categories.age.female : categories.age.male,
      gender: profile.gender,
    });

    return {
      age: ageCategoryName,
      // Если Возрастная, значит skillLevel = null.
      skillLevel: categoryName === DEFAULT_AGE_NAME_CATEGORY ? null : categoryName,
    };
  }, [categoryName, categoriesConfigs, races, profile, raceId]);

  return { category };
}
