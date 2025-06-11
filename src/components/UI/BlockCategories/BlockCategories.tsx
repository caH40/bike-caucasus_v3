import { TextValidationService } from '@/libs/utils/text';
import BoxInput from '../BoxInput/BoxInput';
import t from '@/locales/ru/moderation/championship.json';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import BlockCategory from '../BlockCategory/BlockCategory';
import styles from './BlockCategories.module.css';
import { TBlockCategoriesProps, TGender } from '@/types/index.interface';
import AgeCategoryScale from '@/components/AgeCategoryScale/AgeCategoryScale';
import { useWatch } from 'react-hook-form';
import { useState } from 'react';

const textValidation = new TextValidationService();

/**
 * Контейнер с блоками полей для заполнения данных по категориям в чемпионате.
 */
export default function BlockCategories({
  categories,
  register,
  errors,
  categoriesIndex,
  control,
}: TBlockCategoriesProps) {
  const [ageCategoryGender, setAgeCategoryGender] = useState<TGender>('male');

  const maleCategories = useWatch({
    control,
    name: `categories.${categoriesIndex}.age.male`,
  });
  const femaleCategories = useWatch({
    control,
    name: `categories.${categoriesIndex}.age.female`,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.block__inputs}>
        <BoxInput
          label={t.labels.categoriesName}
          id="name"
          autoComplete="off"
          type="text"
          defaultValue={categories.name}
          // loading={isLoading}
          disabled={categories.name === 'Стандартный'}
          register={register(`categories.${categoriesIndex}.name`, {
            required: t.required,
            minLength: { value: 3, message: t.min.nameCategories },
            maxLength: {
              value: 50,
              message: t.max.nameCategories,
            },
            validate: textValidation.spaces,
          })}
          validationText={errors?.categories?.[categoriesIndex]?.name?.message || ''}
          tooltip={{ text: t.tooltips.categoriesName, id: 'nameChampionship' }}
        />

        <BoxInput
          label={t.labels.categoriesDescription}
          id="name"
          autoComplete="off"
          type="text"
          defaultValue={categories.description}
          register={register(`categories.${categoriesIndex}.description`, {
            maxLength: {
              value: 100,
              message: t.max.descriptionCategories,
            },
            validate: textValidation.spaces,
          })}
          validationText={errors?.categories?.[categoriesIndex]?.description?.message || ''}
          tooltip={{ text: t.tooltips.categoriesDescription, id: `categoriesDescription` }}
        />
      </div>

      <TitleAndLine title={'Возрастные категории'} hSize={2} />

      <div className={styles.spacer}>
        <AgeCategoryScale
          categories={ageCategoryGender === 'male' ? maleCategories : femaleCategories}
        />
      </div>

      <div className={styles.spacer}>
        <BlockCategory
          fieldKey={'age'}
          register={register}
          control={control}
          categoriesIndex={categoriesIndex}
          errors={errors}
          setAgeCategoryGender={setAgeCategoryGender}
        />
      </div>

      <TitleAndLine title={'Спецкатегории'} hSize={2} />

      <div className={styles.spacer}>
        <BlockCategory
          fieldKey={'skillLevel'}
          register={register}
          control={control}
          categoriesIndex={categoriesIndex}
          errors={errors}
        />
      </div>
    </div>
  );
}
