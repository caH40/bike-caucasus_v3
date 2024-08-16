import type { TFormChampionshipCreate } from '@/types/index.interface';

type Params = {
  dataForm: TFormChampionshipCreate;
  championshipId: string | undefined;
  parentChampionshipId: string | undefined;
  organizerId: string; // _id Организатора.
  needDelTrack?: boolean; // Удаление трека
  isEditing: boolean; //
};

/**
 * Функция для сериализации данных при создании Чемпионата.
 * @param dataForm - Данные формы, которые нужно сериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationChampionship({
  dataForm,
  championshipId,
  organizerId,
  needDelTrack,
  parentChampionshipId,
  isEditing,
}: Params): FormData {
  const formData = new FormData();

  formData.set('name', dataForm.name);
  formData.set('description', dataForm.description);
  formData.set('startDate', dataForm.startDate);
  formData.set('endDate', dataForm.endDate);

  // Тип устанавливается только при создании Чемпионата.
  if (!isEditing) {
    formData.set('type', dataForm.type);
  }

  // Количество Этапов в Серии или Туре, если это Этап или Одиночный, то null.
  if (dataForm.quantityStages) {
    formData.set('quantityStages', String(dataForm.quantityStages));
  }

  // Номер Этапа у Этапа.
  if (dataForm.stage) {
    formData.set('stage', String(dataForm.stage));
  }

  formData.set('bikeType', dataForm.bikeType);
  formData.set('organizerId', organizerId);
  formData.set('needDelTrack', String(needDelTrack));

  // _id Чемпионата в БД, необходим для редактирования.
  if (championshipId) {
    formData.set('championshipId', championshipId);
  }
  // _id Чемпионата в БД, необходим для редактирования.
  if (parentChampionshipId) {
    formData.set('parentChampionshipId', parentChampionshipId);
  }
  // dataForm.posterFile может быть null при редактировании Чемпионата.
  if (dataForm.posterFile) {
    formData.set('posterFile', dataForm.posterFile);
  }
  // dataForm.trackGPXFile может быть null при редактировании Чемпионата.
  if (dataForm.trackGPXFile) {
    formData.set('trackGPXFile', dataForm.trackGPXFile);
  }

  return formData;
}
