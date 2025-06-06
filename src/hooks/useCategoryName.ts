import { DEFAULT_AGE_NAME_CATEGORY } from '@/constants/category';
import { createStringCategoryAge } from '@/libs/utils/string-category';
import { TGender, TRaceForForm } from '@/types/index.interface';
import { TCategories } from '@/types/models.interface';
import { useEffect, useState } from 'react';

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
  const [category, setCategory] = useState<CategoryState>({
    age: profile.ageCategory,
    skillLevel: null,
  });

  useEffect(() => {
    const categoriesIdInRace = races.find((r) => r._id === raceId)?.categories;
    const categories = [...categoriesConfigs].find((c) => c._id === categoriesIdInRace);

    if (!categoriesIdInRace || !categories || !profile.yearBirthday) {
      return;
    }

    const ageCategoryName = createStringCategoryAge({
      yearBirthday: profile.yearBirthday,
      categoriesAge: profile.gender === 'female' ? categories.age.female : categories.age.male,
      gender: profile.gender,
    });

    // Если Возрастная, значит skillLevel = null
    if (categoryName === DEFAULT_AGE_NAME_CATEGORY) {
      setCategory({
        age: ageCategoryName,
        skillLevel: null,
      });
    } else {
      setCategory({
        age: ageCategoryName,
        skillLevel: categoryName,
      });
    }
  }, [categoryName, categoriesConfigs, races, profile, raceId]);

  return { category };
}
