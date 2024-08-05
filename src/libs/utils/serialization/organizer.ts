import type { TFormOrganizerCreate } from '@/types/index.interface';

type Params = {
  dataForm: TFormOrganizerCreate;
  isEditing: boolean;
  organizerId: string | undefined;
  posterUrl: string | undefined;
  logoUrl: string | undefined;
};

/**
 * Функция для сериализации данных при создании Организатора.
 * @param dataForm - Данные формы, которые нужно сериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationOrganizer({
  dataForm,
  isEditing,
  organizerId,
  posterUrl,
  logoUrl,
}: Params): FormData {
  const formData = new FormData();

  // formData.set('isEditing', String(isEditing));
  formData.set('name', dataForm.name);
  formData.set('description', dataForm.description);

  // _id Организатора в БД, необходим для редактирования.
  if (organizerId) {
    formData.set('organizerId', organizerId);
  }
  // dataForm.posterFile может быть null при редактировании Организатора.
  if (dataForm.posterFile) {
    formData.set('posterFile', dataForm.posterFile);
  }

  // dataForm.logoFile может быть null при редактировании Организатора.
  if (dataForm.logoFile) {
    formData.set('logoFile', dataForm.logoFile);
  }

  // Если это редактирование и Постер был изменен (dataForm.posterFile существует)
  // то возвращается posterUrl, для удаления старого Постера из облака.
  if (isEditing && posterUrl && dataForm.posterFile) {
    formData.set('posterUrl', posterUrl);
  }

  // Если это редактирование и Логотип был изменен (dataForm.logoFile существует)
  // то возвращается logoUrl, для удаления старого Логотип из облака.
  if (isEditing && logoUrl && dataForm.logoFile) {
    formData.set('logoUrl', logoUrl);
  }

  formData.set('contactInfo', JSON.stringify(dataForm.contactInfo));
  formData.set('address', JSON.stringify(dataForm.address));
  return formData;
}
