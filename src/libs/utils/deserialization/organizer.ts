import { TFormOrganizerCreate } from '@/types/index.interface';

/**
 * Функция для десериализации данных при создании Организатора.
 * @param dataForm - Данные формы, которые нужно десериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function deserializeOrganizer(serializedFormData: FormData) {
  const organizer = {} as TFormOrganizerCreate & {
    isEditing: boolean;
    organizerId?: string;
  } & {
    [key: string]: any;
  };

  for (const [name, value] of serializedFormData.entries()) {
    switch (name) {
      case 'contactInfo':
        if (typeof value === 'string') {
          organizer[name] = JSON.parse(value);
        }
        break;

      case 'address':
        if (typeof value === 'string') {
          organizer[name] = JSON.parse(value);
        }
        break;

      case 'isEditing':
        organizer[name] = value === 'true' ? true : false;
        break;

      default:
        organizer[name] = value === '' ? null : value;
    }
  }

  return organizer;
}
