// types
import type { TRaceForForm } from '@/types/index.interface';

type Params = {
  dataForm: { races: TRaceForForm[] };
  urlTracksForDel: string[]; // Массив url треков для удаления в облаке.
};

/**
 * Функция для сериализации данных при создании Чемпионата.
 * @param dataForm - Данные формы, которые нужно сериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationChampionshipRaces({
  dataForm,
  urlTracksForDel,
}: Params): FormData {
  const formData = new FormData();

  if (!!urlTracksForDel?.length) {
    formData.set('urlTracksForDel', JSON.stringify(urlTracksForDel));
  }

  // Преобразование поля races и добавление в fomData.
  if (dataForm.races) {
    dataForm.races.forEach((race, index) => {
      formData.set(`races[${index}][number]`, race.number.toString());
      formData.set(`races[${index}][name]`, race.name);
      formData.set(`races[${index}][description]`, race.description);
      formData.set(`races[${index}][distance]`, race.distance.toString());
      formData.set(`races[${index}][laps]`, race.laps.toString());
      formData.set(`races[${index}][registeredRiders]`, JSON.stringify(race.registeredRiders));
      formData.set(`races[${index}][categories]`, race.categories);

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
