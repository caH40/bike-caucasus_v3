import { SubmitHandler, UseFormReset } from 'react-hook-form';
import { toast } from 'sonner';

import { registerForChampionship } from '@/actions/registration-champ';
import { validateRequiredFields } from '@/components/UI/Forms/FormRaceRegistration/utils';

// types
import {
  TFormRaceRegistration,
  TProfileForRegistration,
  TProfileKey,
} from '@/types/index.interface';
import { useLoadingStore } from '@/store/loading';
import { useRouter } from 'next/navigation';

type Params = {
  championshipId: string;
  profile: TProfileForRegistration;
  reset: UseFormReset<TFormRaceRegistration>;
};

export function useSubmitRegistration({
  championshipId,
  profile,
  reset,
}: Params): SubmitHandler<TFormRaceRegistration> {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  return async (dataForm) => {
    try {
      const profileEntries = Object.entries(profile) as [TProfileKey, string | undefined][];

      for (const [key, value] of profileEntries) {
        const res = validateRequiredFields(value, key);

        if (!res.ok) {
          throw new Error(res.message);
        }
      }
      setLoading(true);

      const response = await registerForChampionship({
        championshipId,
        raceId: dataForm.raceId,
        startNumber: +dataForm.startNumber,
        teamVariable: dataForm.teamVariable,
        categoryName: dataForm.categoryName,
      });

      // Завершение отображение статуса загрузки.
      setLoading(false);
      router.refresh();
      // Отображение статуса сохранения События в БД.
      if (!response.ok) {
        throw new Error(response.message);
      }

      reset({ teamVariable: '' });
      toast.success(response.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
}
