import { useState } from 'react';

import { buttonsGender } from '@/constants/buttons';
import { useCategoryFieldsByGender } from '@/hooks/useCategoryFieldsByGender';
import FilterRidersForAddResult from '../Filters/FilterRidersForAddResult/Filters';
import AddRemoveSquareButtonGroup from '@/components/AddRemoveSquareButtonGroup/AddRemoveSquareButtonGroup';
import AddRemoveSquareButton from '../Buttons/AddRemoveSquareButton';
import AgeCategoryInputFields from './AgeCategoryInputFields.tsx';
import SkillLevelCategoryInputFields from './SkillLevelCategoryInputFields';
import styles from './BlockCategory.module.css';

// types
import { TBlockCategoryProps } from '@/types/index.interface';
import Spacer from '@/components/Spacer/Spacer';

/**
 * Блок полей для заполнения данных по возрастным категориям в чемпионате.
 */
export default function BlockCategory({
  control,
  categoriesIndex,
  register,
  errors,
  fieldKey,
}: TBlockCategoryProps) {
  const [genderButtonNumber, setGenderButtonNumber] = useState<number>(0);

  // Базовый путь до поля age.
  const fieldPathRoot = `categories.${categoriesIndex}.${fieldKey}` as const;

  const { currentFields, append, remove, categoryProperty } = useCategoryFieldsByGender({
    control,
    categoriesIndex,
    genderButtonNumber,
    fieldPathRoot,
  });

  const addCategoryFn = () => {
    if (fieldKey === 'age') {
      append({ name: '', min: 18, max: 120 });
    } else {
      append({ name: 'Про', description: 'Профессиональные спортсмены' });
    }
  };

  const removeCategoryFn = (index: number): void => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить эту категорию?');
    if (confirmed) {
      remove(index);
    }
  };

  return (
    <div>
      {/* Блок установки возрастных категорий */}
      <Spacer margin="b-sm">
        <FilterRidersForAddResult
          activeIdBtn={genderButtonNumber}
          setActiveIdBtn={setGenderButtonNumber}
          buttons={buttonsGender}
        />
      </Spacer>

      {/* Кнопка добавления категорий */}
      <AddRemoveSquareButtonGroup
        label={`Добавить ${categoryProperty === 'male' ? 'мужскую' : 'женскую'} категорию`}
      >
        <AddRemoveSquareButton action={'add'} actionFunction={addCategoryFn} />
      </AddRemoveSquareButtonGroup>

      {currentFields.map((field, index) => {
        const fieldPathPrefix = `${fieldPathRoot}.${categoryProperty}.${index}` as const;
        const fieldErrors =
          errors?.categories?.[categoriesIndex]?.[fieldKey]?.[categoryProperty]?.[index];

        return (
          <div className={styles.block__inputs} key={field.id}>
            {/* Кнопка удаления категорий */}
            {/* Нулевой элемент (для возрастных категорий) это категория по умолчанию, её нельзя удалять */}
            {!(fieldKey === 'age' && index === 0) && (
              <AddRemoveSquareButtonGroup label={'Удалить данную категорию'}>
                <AddRemoveSquareButton
                  action={'delete'}
                  actionFunction={() => removeCategoryFn(index)}
                />
              </AddRemoveSquareButtonGroup>
            )}

            {fieldKey === 'age' ? (
              <AgeCategoryInputFields
                register={register}
                categoryProperty={categoryProperty}
                fieldPathPrefix={fieldPathPrefix}
                fieldErrors={fieldErrors}
              />
            ) : (
              <SkillLevelCategoryInputFields
                register={register}
                fieldPathPrefix={fieldPathPrefix}
                fieldErrors={fieldErrors}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
