'use client';

import { toast } from 'sonner';
import { SubmitHandler } from 'react-hook-form';

import { formatCategoriesFields } from './categories-format';
import { useLoadingStore } from '@/store/loading';
import { formateAndStripContent } from './utils';
import { serializationChampionship } from '@/libs/utils/serialization/championship';
import t from '@/locales/ru/moderation/championship.json';

// types
import { TFormChampionshipCreate, TUseSubmitChampionshipProps } from '@/types/index.interface';

import { useRouter } from 'next/navigation';

/**
 * Отправка формы создания/редактирования Чемпионата.
 */
export const useSubmitChampionship = ({
  championshipForEdit,
  isSeriesOrTourInForm,
  organizerId,
  urlTracksForDel,
  fetchChampionshipCreated,
  putChampionship,
  reset,
}: TUseSubmitChampionshipProps): SubmitHandler<TFormChampionshipCreate> => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const isEditing = !!championshipForEdit;

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormChampionshipCreate> = async (dataForm) => {
    const racesWithCategoriesFormatted = dataForm.races.map((race) => {
      const { categoriesAgeFemale, categoriesAgeMale } = formatCategoriesFields({
        categoriesAgeFemale: race.categoriesAgeFemale,
        categoriesAgeMale: race.categoriesAgeMale,
      });

      return { ...race, categoriesAgeFemale, categoriesAgeMale };
    });

    // Старт отображение статуса загрузки.
    setLoading(true);

    // Сериализация данных перед отправкой на сервер.
    const championshipId = championshipForEdit?._id;
    const parentChampionshipId = dataForm.parentChampionship?._id;

    // Обработка текстов.
    const { nameStripedHtmlTags, descriptionFormatted } = formateAndStripContent({
      name: dataForm.name,
      description: dataForm.description,
    });

    // Если Серия или Тур, то убрать объект инициализации из races.
    if (isSeriesOrTourInForm) {
      dataForm.races = [];
    }

    // Сериализация данных в FormData перед отправкой на сервер.
    const dataSerialized = serializationChampionship({
      dataForm: {
        ...dataForm,
        races: racesWithCategoriesFormatted,
        name: nameStripedHtmlTags,
        description: descriptionFormatted,
      },
      championshipId,
      parentChampionshipId,
      organizerId,
      isEditing,
      urlTracksForDel: urlTracksForDel.current,
    });

    // Отправка данных на сервер и получение ответа после завершения операции.
    const messageErr = t.errors.hasNotPropsFunction;
    let response = {
      data: null,
      ok: false,
      message: messageErr,
    };

    if (fetchChampionshipCreated) {
      response = await fetchChampionshipCreated(dataSerialized);
    } else if (putChampionship && championshipForEdit) {
      response = await putChampionship({
        dataSerialized,
        urlSlug: championshipForEdit.urlSlug,
      });
    } else {
      return toast.error(messageErr);
    }

    // Завершение отображение статуса загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (response.ok) {
      reset();
      toast.success(response.message);

      router.push('/moderation/championship/list');
    } else {
      toast.error(response.message);
    }
  };

  return onSubmit;
};
