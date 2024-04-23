import { UseFormRegisterReturn } from 'react-hook-form';

export interface PropsBoxInputAuth {
  id: string;
  autoComplete: string;
  type: string;
  label: string;
  validationText?: string;
  register: UseFormRegisterReturn; // FieldValues
  linkLabel?: string; // описание страницы для перехода
  link?: string; // путь на страницу
  disabled?: boolean;
}
