import { toast } from 'sonner';

import { upsertGeneralClassification } from '@/actions/gc';

/**
 * Обработка клика на создание/обновление генеральной классификации.
 */
export const upsertItem = async (championshipId: string) => {
  const confirmed = window.confirm(`Подтвердите обновление таблиц генеральной классификации`);
  if (!confirmed) {
    return toast.warning(`Отменён запрос!`);
  }

  try {
    const res = await upsertGeneralClassification(championshipId);

    if (!res.ok) {
      throw new Error(res.message);
    }

    toast.success(res.message);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
};
