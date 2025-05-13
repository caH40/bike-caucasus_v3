import { useState } from 'react';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import { buttonsGender } from '@/constants/buttons';
import { TCategoriesConfigsClient } from '@/types/index.interface';
import FilterRidersForAddResult from '../Filters/FilterRidersForAddResult/Filters';
import BoxInput from '../BoxInput/BoxInput';
import { TextValidationService } from '@/libs/utils/text';
import AddRemoveSquareButtonGroup from '@/components/AddRemoveSquareButtonGroup/AddRemoveSquareButtonGroup';
import AddRemoveSquareButton from '../Buttons/AddRemoveSquareButton';
import SquareButtonsContainer from '@/components/SquareButtonsContainer/SquareButtonsContainer';
import { useCategoryFieldsByGender } from '@/hooks/useCategoryFieldsByGender';

import styles from './BlockCategory.module.css';

type Props = {
  register: UseFormRegister<{ categories: TCategoriesConfigsClient[] }>;
  errors: FieldErrors<{ categories: TCategoriesConfigsClient[] }>;
  control: Control<{ categories: TCategoriesConfigsClient[] }>;
  categoriesIndex: number;
};

const textValidation = new TextValidationService();

/**
 * Блок полей для заполнения данных по возрастным категориям в чемпионате.
 */
export default function BlockAgeCategory({
  control,
  categoriesIndex,
  register,
  errors,
}: Props) {
  const [genderButtonNumber, setGenderButtonNumber] = useState<number>(0);

  // Базовый путь до поля age.
  const fieldPathRoot = `categories.${categoriesIndex}.age` as const;

  const { currentFields, append, remove, categoryProperty } = useCategoryFieldsByGender({
    control,
    categoriesIndex,
    genderButtonNumber,
    fieldPathRoot,
  });

  const addCategoryFn = () => {
    append({ name: 'test', min: 18, max: 120 });
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
      <div className={styles.spacer__buttons_cat}>
        <FilterRidersForAddResult
          activeIdBtn={genderButtonNumber}
          setActiveIdBtn={setGenderButtonNumber}
          buttons={buttonsGender}
        />
      </div>

      {currentFields.map((field, index) => {
        const pathBase = `${fieldPathRoot}.${categoryProperty}.${index}` as const;
        const ageErrors =
          errors?.categories?.[categoriesIndex]?.age?.[categoryProperty]?.[index];

        return (
          <div className={styles.block__inputs} key={field.id}>
            {/* Кнопки удаления добавления категорий */}

            {/* Кнопка добавления отображается только у нулевого элемента */}
            <SquareButtonsContainer>
              {index === 0 && (
                <AddRemoveSquareButtonGroup
                  label={`Добавить ${
                    categoryProperty === 'male' ? 'мужскую' : 'женскую'
                  } категорию`}
                >
                  <AddRemoveSquareButton action={'add'} actionFunction={addCategoryFn} />
                </AddRemoveSquareButtonGroup>
              )}

              {/* Нулевой элемент это категория по умолчанию, её нельзя удалять */}
              {index !== 0 && (
                <AddRemoveSquareButtonGroup label={'Удалить данную категорию'}>
                  <AddRemoveSquareButton
                    action={'delete'}
                    actionFunction={() => removeCategoryFn(index)}
                  />
                </AddRemoveSquareButtonGroup>
              )}
            </SquareButtonsContainer>

            <BoxInput
              label={`Название ${
                categoryProperty === 'male' ? 'мужской' : 'женской'
              } категории`}
              id={`${pathBase}.name`} // путь к полю name категории
              autoComplete="off"
              type="text"
              register={register(`${pathBase}.name`, {
                minLength: { value: 2, message: 'больше 1х символа' },
                maxLength: {
                  value: 10,
                  message: 'не больше 10 символов',
                },
                validate: textValidation.spaces,
              })}
              validationText={ageErrors?.name?.message || ''}
            />

            <BoxInput
              label={`Нижнее значение:*`}
              id={`${pathBase}.min`} // путь к полю name категории
              autoComplete="off"
              type="number"
              step={1}
              register={register(`${pathBase}.min`, {
                required: 'заполните',
              })}
              validationText={ageErrors?.min?.message || ''}
            />

            <BoxInput
              label={`Верхнее значение:*`}
              id={`${pathBase}.max`} // путь к полю name категории
              autoComplete="off"
              type="number"
              step={1}
              register={register(`${pathBase}.max`, {
                required: 'заполните',
              })}
              validationText={ageErrors?.max?.message || ''}
            />
          </div>
        );
      })}
    </div>
  );
}
