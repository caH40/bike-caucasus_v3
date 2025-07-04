// types
import type { TClientMeta, TRaceForFormNew } from '@/types/index.interface';

type Params = {
  dataForm: { races: TRaceForFormNew[] };

  client: TClientMeta;
};

/**
 * Функция для сериализации данных при создании Чемпионата.
 * championshipId добавляется в сервисе.
 * @param dataForm - Данные формы, которые нужно сериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationChampionshipRaces({ dataForm, client }: Params): FormData {
  const formData = new FormData();

  // Преобразование поля races и добавление в fomData.
  if (dataForm.races) {
    dataForm.races.forEach((race, index) => {
      // Проверка на наличие id пакета категорий.
      const categories = race.categories;
      if (!categories) {
        throw new Error(`Не получен id пакета категорий для заезда ${race.name}`);
      }

      if (race._id) {
        formData.set(`races[${index}][_id]`, race._id);
      }

      formData.set(`races[${index}][number]`, race.number.toString());
      formData.set(`races[${index}][name]`, race.name);
      formData.set(`races[${index}][description]`, race.description);
      formData.set(`races[${index}][distance]`, race.distance.toString());
      formData.set(`races[${index}][laps]`, race.laps.toString());
      formData.set(`races[${index}][categories]`, categories);
      formData.set(`races[${index}][trackDistance]`, String(race.trackDistance));

      if (race.ascent !== undefined) {
        formData.set(`races[${index}][ascent]`, race.ascent.toString());
      }
    });
  }

  if (client) {
    formData.set('client', JSON.stringify(client));
  }

  return formData;
}
