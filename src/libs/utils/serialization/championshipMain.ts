import { formateAndStripContent } from '@/components/UI/Forms/FormChampionship/utils';
import type { TFormChampionshipCreate } from '@/types/index.interface';

type Params = {
  dataForm: TFormChampionshipCreate;
  championshipId: string | undefined;
  parentChampionshipId: string | undefined;
  organizerId: string; // _id Организатора.
  isEditing: boolean; //
  urlTracksForDel: string[]; // Массив url треков для удаления в облаке.
};

/**
 * Функция для сериализации данных при создании Чемпионата.
 * @param dataForm - Данные формы, которые нужно сериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationChampionshipMain({
  dataForm,
  championshipId,
  organizerId,
  parentChampionshipId,
  isEditing,
  urlTracksForDel,
}: Params): FormData {
  const formData = new FormData();

  // Обработка текстов.
  const { nameStripedHtmlTags, descriptionFormatted } = formateAndStripContent({
    name: dataForm.name,
    description: dataForm.description,
  });

  formData.set('name', nameStripedHtmlTags);
  formData.set('description', descriptionFormatted);
  formData.set('startDate', dataForm.startDate);
  formData.set('endDate', dataForm.endDate);

  if (dataForm.racePointsTable) {
    formData.set('racePointsTable', dataForm.racePointsTable);
  }

  // Тип устанавливается только при создании Чемпионата.
  if (!isEditing) {
    formData.set('type', dataForm.type);
  }

  // Количество Этапов в Серии или Туре, если это Этап или Одиночный, то null.
  if (dataForm.quantityStages) {
    formData.set('quantityStages', String(dataForm.quantityStages));
  }

  // Номер Этапа у Этапа.
  if (dataForm.stageOrder) {
    formData.set('stageOrder', String(dataForm.stageOrder));
  }

  if (dataForm.awardedProtocols) {
    formData.set('awardedProtocols', JSON.stringify(dataForm.awardedProtocols));
  }

  formData.set('isCountedStageInGC', dataForm.isCountedStageInGC ? 'true' : 'false');
  formData.set('requiredStage', dataForm.requiredStage ? 'true' : 'false');

  formData.set('bikeType', dataForm.bikeType);
  formData.set('organizerId', organizerId);

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

  if (!!urlTracksForDel?.length) {
    formData.set('urlTracksForDel', JSON.stringify(urlTracksForDel));
  }

  return formData;
}
