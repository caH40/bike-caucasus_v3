import { Path } from 'react-hook-form';

import {
  TCategoriesFormType,
  TSkillLevelCategoryInputFieldsProps,
} from '@/types/index.interface';

import BoxInput from '../BoxInput/BoxInput';
import { TextValidationService } from '@/libs/utils/text';

const textValidation = new TextValidationService();

/**
 * Поля input для заполнения данных по возрастным категориям в чемпионате.
 */
export default function SkillLevelCategoryInputFields({
  register,
  fieldPathPrefix,
  fieldErrors,
}: TSkillLevelCategoryInputFieldsProps) {
  return (
    <>
      <BoxInput
        label={`Название:*`}
        id={`${fieldPathPrefix}.name`}
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
        label={`Краткое описание:`}
        id={`${fieldPathPrefix}.description`}
        autoComplete="off"
        type="text"
        register={register(`${fieldPathPrefix}.description` as Path<TCategoriesFormType>, {
          minLength: { value: 2, message: 'больше 1х символа' },
          maxLength: { value: 100, message: 'не больше 100 символов' },
          validate: textValidation.spaces,
        })}
        validationText={fieldErrors?.description?.message || ''}
      />
    </>
  );
}
