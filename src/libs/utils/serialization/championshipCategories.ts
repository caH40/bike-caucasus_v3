import { formatCategoriesFields } from '@/components/UI/Forms/FormChampionship/categories-format';
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
export function serializationChampionship({
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

  // Преобразование races в необходимую структуру для сервера.
  const racesWithCategoriesFormatted =
    dataForm.races &&
    dataForm.races.map((race) => {
      const { categoriesAgeFemale, categoriesAgeMale } = formatCategoriesFields({
        categoriesAgeFemale: race.categoriesAgeFemale,
        categoriesAgeMale: race.categoriesAgeMale,
      });

      return {
        ...race,
        categoriesAgeFemale,
        categoriesAgeMale,
      };
    });

  // Преобразование поля races и добавление в fomData.
  if (racesWithCategoriesFormatted) {
    racesWithCategoriesFormatted.forEach((race, index) => {
      formData.set(`races[${index}][number]`, race.number.toString());
      formData.set(`races[${index}][name]`, race.name);
      formData.set(`races[${index}][description]`, race.description);
      formData.set(`races[${index}][distance]`, race.distance.toString());
      formData.set(`races[${index}][laps]`, race.laps.toString());
      formData.set(`races[${index}][registeredRiders]`, JSON.stringify(race.registeredRiders));
      formData.set(
        `races[${index}][categoriesAgeFemale]`,
        JSON.stringify(race.categoriesAgeFemale)
      );
      formData.set(
        `races[${index}][categoriesAgeMale]`,
        JSON.stringify(race.categoriesAgeMale)
      );

      if (race.ascent !== undefined) {
        formData.set(`races[${index}][ascent]`, race.ascent.toString());
      }

      if (race.trackGPXFile) {
        formData.set(`races[${index}][trackGPXFile]`, race.trackGPXFile);
      }

      if (race.trackGPXUrl) {
        formData.set(`races[${index}][trackGPXUrl]`, race.trackGPXUrl);
      }
    });
  }

  return formData;
}
