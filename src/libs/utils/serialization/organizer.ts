import type { TFormOrganizerCreate } from '@/types/index.interface';

/**
 * Функция для сериализации данных при создании Организатора.
 * @param dataForm - Данные формы, которые нужно сериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationOrganizerCreate(dataForm: TFormOrganizerCreate): FormData {
  const formData = new FormData();

  formData.set('name', dataForm.name);
  formData.set('description', dataForm.description);
  // dataForm.logoFile может быть null при редактировании Организатора.
  if (dataForm.logoFile) {
    formData.set('poster', dataForm.logoFile);
  }
  // dataForm.posterFile может быть null при редактировании Организатора.
  if (dataForm.posterFile) {
    formData.set('posterFile', dataForm.posterFile);
  }

  formData.set('contactInfo', JSON.stringify(dataForm.contactInfo));
  formData.set('address', JSON.stringify(dataForm.address));
  return formData;
}
