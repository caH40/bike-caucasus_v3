import { Path } from 'react-hook-form';

import BoxInput from '../BoxInput/BoxInput';
import { TextValidationService } from '@/libs/utils/text';
import { TAgeCategoryInputFieldsProps, TCategoriesFormType } from '@/types/index.interface';

const textValidation = new TextValidationService();

/**
 * Поля input для заполнения данных по возрастным категориям в чемпионате.
 */
export default function AgeCategoryInputFields({
  register,
  categoryProperty,
  fieldPathPrefix,
  fieldErrors,
}: TAgeCategoryInputFieldsProps) {
  return (
    <>
      <BoxInput
        label={`Название ${categoryProperty === 'male' ? 'мужской' : 'женской'} категории`}
        id={`${fieldPathPrefix}.name`} // путь к полю name категории
        autoComplete="off"
        type="text"
        register={register(`${fieldPathPrefix}.name`, {
          minLength: { value: 2, message: 'больше 1х символа' },
          maxLength: { value: 15, message: 'не больше 15 символов' },
          validate: textValidation.spaces,
        })}
        validationText={fieldErrors?.name?.message || ''}
      />

      <BoxInput
        label={`Нижнее значение:*`}
        id={`${fieldPathPrefix}.min`} // путь к полю name категории
        autoComplete="off"
        type="number"
        step={1}
        min={1}
        register={register(`${fieldPathPrefix}.min` as Path<TCategoriesFormType>, {
          required: 'заполните',
          validate: (value) => (value && +value >= 1) || 'мин. 1',
        })}
        validationText={fieldErrors?.min?.message || ''}
      />

      <BoxInput
        label={`Верхнее значение:*`}
        id={`${fieldPathPrefix}.max`} // путь к полю name категории
        autoComplete="off"
        type="number"
        step={1}
        max={120}
        register={register(`${fieldPathPrefix}.max` as Path<TCategoriesFormType>, {
          required: 'заполните',
          validate: (value) => (value && +value <= 120) || 'макс. 120',
        })}
        validationText={fieldErrors?.max?.message || ''}
      />
    </>
  );
}
