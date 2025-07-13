import { useRouter } from 'next/navigation';
import { SubmitHandler, UseFormReset } from 'react-hook-form';
import { toast } from 'sonner';

import { postRiderRaceResult } from '@/actions/result-race';
import { timeDetailsToMilliseconds } from '@/libs/utils/date';
import { serializationResultRaceRider } from '@/libs/utils/serialization/resultRaceRider';

// types
import { TFormResultRace } from '@/types/index.interface';
import { useLoadingStore } from '@/store/loading';

type Params = {
  raceId: string;
  championshipId: string;
  reset: UseFormReset<TFormResultRace>;
};

/**
 * Хук отправки формы на сервер.
 */
export function useAddResultRaceSubmit({ raceId, championshipId, reset }: Params): {
  onSubmit: SubmitHandler<TFormResultRace>;
} {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const router = useRouter();

  const onSubmit: SubmitHandler<TFormResultRace> = async (dataFromForm) => {
    const timeDetailsInMilliseconds = timeDetailsToMilliseconds(dataFromForm.time);

    // Получение стартового номера.
    const startNumber = () => {
      // Если введен новый номер, значит он используется как стартовый номер.
      if (!!dataFromForm.newStartNumber && +dataFromForm.newStartNumber !== 0) {
        return +dataFromForm.newStartNumber;
      }

      return +dataFromForm.riderRegisteredInRace.startNumber;
    };

    const dataSerialized = serializationResultRaceRider({
      ...dataFromForm.rider,
      disqualification: dataFromForm.disqualification?.type
        ? dataFromForm.disqualification
        : undefined,
      timeDetailsInMilliseconds,
      startNumber: startNumber(),
      raceId,
      championshipId,
      categoryName: dataFromForm.categoryName,
    });

    setLoading(true);
    const response = await postRiderRaceResult({ dataFromFormSerialized: dataSerialized });

    setLoading(false);

    if (response.ok) {
      reset();
      toast.success(response.message);
      router.refresh();
    } else {
      toast.error(response.message);
    }
  };

  return { onSubmit };
}
