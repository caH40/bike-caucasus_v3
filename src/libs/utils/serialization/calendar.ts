import type { TFormCalendar } from '@/types/index.interface';

/**
 * Функция для сериализации данных при создании новостей.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationCalendarCreate(dataForm: TFormCalendar): FormData {
  const formData = new FormData();
  formData.set('title', dataForm.title);
  formData.set('date', dataForm.date); // Передается в формате yyyy-mm-dd.
  formData.set('urlSlug', dataForm.urlSlug);

  return formData;
}
