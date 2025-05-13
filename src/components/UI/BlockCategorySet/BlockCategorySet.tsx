import { FieldErrors, UseFormRegister, Control } from 'react-hook-form';

import BoxInput from '../BoxInput/BoxInput';
import { TCategoriesConfigsClient } from '@/types/index.interface';
import styles from './BlockCategorySet.module.css';
import { TextValidationService } from '@/libs/utils/text';

type Props = {
  register: UseFormRegister<{ categories: TCategoriesConfigsClient[] }>;
  errors: FieldErrors<{ categories: TCategoriesConfigsClient[] }>;
  control: Control<{ categories: TCategoriesConfigsClient[] }>;
};

const textValidation = new TextValidationService();

/**
 * Блоки полей для заполнения данных по категориям в чемпионате.
 */
export default function BlockCategorySet({ register, errors, index, control }: Props) {
  // Устанавливаем ключ для принудительного перерендеривания компонента при изменении categoryProperty
  // const key = `${index}-${categoryProperty}`;

  {
    // categoryFields.map((field, index) => (
    //   <div key={field.id}>
    //     {/* Блок ввода Названия */}
    //     <BoxInput
    //       label={t.labels.nameChampionship}
    //       id="name"
    //       autoComplete="off"
    //       type="text"
    //       defaultValue={field.name}
    //       loading={isLoading}
    //       disabled={field.name === 'Стандартный'}
    //       register={register(`categories.${index}.name`, {
    //         required: t.required,
    //         minLength: { value: 3, message: t.min.nameChampionship },
    //         maxLength: {
    //           value: 50,
    //           message: t.max.nameChampionship,
    //         },
    //         validate: textValidation.spaces,
    //       })}
    //       validationText={
    //         errors?.categories?.[index]?.name ? errors?.categories?.[index]?.name.message : ''
    //       }
    //       tooltip={{ text: t.tooltips.categoriesName, id: 'nameChampionship' }}
    //     />
    //     <button
    //       type="button"
    //       onClick={() => removeCategory(index)}
    //       style={{ marginLeft: '8px' }}
    //     >
    //       Удалить
    //     </button>
    //   </div>
    // ));
  }

  return <div key={'key'}>{/* Добавляем key сюда */}</div>;
}
