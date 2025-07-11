import { useState } from 'react';
import { toast } from 'sonner';

import { createPayment } from '@/actions/payment';

// types
import { TCreatePaymentWithMeta, TCurrency } from '@/types/index.interface';

type Params = {
  userId: number; // id пользователя на сайте.
  returnUrl: string;
  unitPrice: number;
  currency: TCurrency;
};

export function useChampionshipPurchase({ userId, returnUrl, currency, unitPrice }: Params) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClickPurchase = async (quantity: number) => {
    // Исключение случайного второго клика по кнопке.
    if (isLoading) {
      return;
    }

    if (quantity <= 0) {
      toast.error('Количество слотов должно быть больше 1!');
      return;
    }

    try {
      setIsLoading(true);
      const createPayload: TCreatePaymentWithMeta = {
        amount: {
          value: String(unitPrice * quantity),
          currency,
        },
        capture: false,
        confirmation: {
          type: 'redirect',
          return_url: returnUrl,
        },
        metadata: {
          userId,
          quantity,
          entityName: 'championship',
        },

        description: `Покупка слотов в количестве ${quantity}шт. на создание чемпионатов на сайте bike-caucasus.ru`,
      };

      const { data, ok, message } = await createPayment({ createPayload });

      if (ok && data && data.confirmation_url) {
        window.location.href = data.confirmation_url;
      } else {
        toast.error(message);
      }
    } catch (error) {
      let errorMessage = 'Непредвиденная ошибка при покупке услуги!';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      // eslint-disable-next-line no-console
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleClickPurchase, isLoading };
}
