import type { TFormChampionshipCreate } from '@/types/index.interface';

type Params = {
  dataForm: TFormChampionshipCreate;
  isEditing: boolean;
  championshipId: string | undefined;
  posterUrl: string | undefined;
  trackGPXUrl: string | null;
  organizerId: string; // _id Организатора.
};

/**
 * Функция для сериализации данных при создании Чемпионата.
 * @param dataForm - Данные формы, которые нужно сериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationChampionship({
  dataForm,
  isEditing,
  championshipId,
  posterUrl,
  trackGPXUrl,
  organizerId,
}: Params): FormData {
  const formData = new FormData();

  // formData.set('isEditing', String(isEditing));
  formData.set('name', dataForm.name);
  formData.set('description', dataForm.description);
  formData.set('startDate', dataForm.startDate);
  formData.set('endDate', dataForm.endDate);
  formData.set('type', dataForm.type);
  formData.set('bikeType', dataForm.bikeType);
  formData.set('organizerId', organizerId);

  // _id Чемпионата в БД, необходим для редактирования.
  if (championshipId) {
    formData.set('championshipId', championshipId);
  }
  // dataForm.posterFile может быть null при редактировании Чемпионата.
  if (dataForm.posterFile) {
    formData.set('posterFile', dataForm.posterFile);
  }

  // dataForm.trackGPXFile может быть null при редактировании Чемпионата.
  if (dataForm.trackGPXFile) {
    formData.set('trackGPXFile', dataForm.trackGPXFile);
  }

  // Если это редактирование и Постер был изменен (dataForm.posterFile существует)
  // то возвращается posterUrl, для удаления старого Постера из облака.
  if (isEditing && posterUrl && dataForm.posterFile) {
    formData.set('posterUrl', posterUrl);
  }

  // Если это редактирование и Постер был изменен (dataForm.posterFile существует)
  // то возвращается posterUrl, для удаления старого Постера из облака.
  if (isEditing && trackGPXUrl && dataForm.posterFile) {
    formData.set('posterUrl', trackGPXUrl);
  }

  return formData;
}
