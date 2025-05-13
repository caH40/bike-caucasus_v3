import { FieldErrors, UseFormRegister, Control, FieldArrayWithId } from 'react-hook-form';

import BoxInput from '../BoxInput/BoxInput';
import { TCategoriesConfigsClient } from '@/types/index.interface';
import t from '@/locales/ru/moderation/championship.json';
import styles from './BlockCategories.module.css';
import { TextValidationService } from '@/libs/utils/text';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import BlockAgeCategory from '../BlockCategory/BlockAgeCategory';

type Props = {
  categories: FieldArrayWithId<
    {
      categories: TCategoriesConfigsClient[];
    },
    'categories',
    'id'
  >;
  register: UseFormRegister<{ categories: TCategoriesConfigsClient[] }>;
  errors: FieldErrors<{ categories: TCategoriesConfigsClient[] }>;
  control: Control<{ categories: TCategoriesConfigsClient[] }>;
  categoriesIndex: number;
};

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
}: Props) {
  // const key = `${index}-${categoryProperty}`;

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
          validationText={
            errors?.categories?.[categoriesIndex]?.name
              ? errors?.categories?.[categoriesIndex]?.name.message
              : ''
          }
          tooltip={{ text: t.tooltips.categoriesName, id: 'nameChampionship' }}
        />

        <BoxInput
          label={t.labels.categoriesDescription}
          id="name"
          autoComplete="off"
          type="text"
          defaultValue={categories.description}
          // loading={isLoading}
          disabled={categories.name === 'Стандартный'}
          register={register(`categories.${categoriesIndex}.description`, {
            maxLength: {
              value: 100,
              message: t.max.descriptionCategories,
            },
            validate: textValidation.spaces,
          })}
          validationText={
            errors?.categories?.[categoriesIndex]?.description
              ? errors?.categories?.[categoriesIndex]?.description.message
              : ''
          }
          tooltip={{ text: t.tooltips.categoriesDescription, id: `categoriesDescription` }}
        />
      </div>

      <TitleAndLine title={'Возрастные категории'} />

      <div className={styles.spacer}>
        <BlockAgeCategory
          register={register}
          control={control}
          categoriesIndex={categoriesIndex}
          errors={errors}
        />
      </div>

      <TitleAndLine title={'Категории по уровню подготовки'} />
    </div>
  );
}
