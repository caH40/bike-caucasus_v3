'use client';

import { toast } from 'sonner';
import { SubmitHandler } from 'react-hook-form';

import { useLoadingStore } from '@/store/loading';
import { serializationChampionshipMain } from '@/libs/utils/serialization/championshipMain';
import t from '@/locales/ru/moderation/championship.json';

// types
import { TFormChampionshipCreate, TUseSubmitChampionshipParams } from '@/types/index.interface';

import { useRouter } from 'next/navigation';

/**
 * Отправка формы создания/редактирования Чемпионата.
 */
export const useSubmitChampionshipMain = ({
  championshipForEdit,
  organizerId,
  urlTracksForDel,
  fetchChampionshipCreated,
  putChampionship,
  reset,
  setIsFormDirty,
}: TUseSubmitChampionshipParams): SubmitHandler<TFormChampionshipCreate> => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const isEditing = !!championshipForEdit;

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormChampionshipCreate> = async (dataForm) => {
    // Старт отображение статуса загрузки.
    setLoading(true);

    // Сериализация данных перед отправкой на сервер.
    const championshipId = championshipForEdit?._id;
    const parentChampionshipId = dataForm.parentChampionship?._id;

    // Сериализация данных в FormData перед отправкой на сервер.
    const dataSerialized = serializationChampionshipMain({
      dataForm,
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

    // В зависимости от типа формы (редактирование/создание Чемпионата) выбирается соответствующий обработчик.
    if (fetchChampionshipCreated) {
      response = await fetchChampionshipCreated(dataSerialized);
    } else if (putChampionship && championshipForEdit) {
      response = await putChampionship({
        dataSerialized,
        urlSlug: championshipForEdit.urlSlug,
      });
    } else {
      setLoading(false);
      return toast.error(messageErr);
    }

    // Завершение отображение статуса загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (response.ok) {
      reset();
      toast.success(response.message);
      setIsFormDirty(false);
      router.push('/moderation/championship/list');
    } else {
      toast.error(response.message);
    }
  };

  return onSubmit;
};
