import { useState } from 'react';
import { toast } from 'sonner';

import { createPayment } from '@/actions/payment';

// types
import { TCreatePaymentWithMeta, TCurrency } from '@/types/index.interface';
import { ICheckoutCustomer, IReceipt } from '@a2seven/yoo-checkout';

type Params = {
  userId: number; // id пользователя на сайте.
  returnUrl: string;
  payloadData: {
    customer: ICheckoutCustomer; // Данные покупателя.
    unitPrice: number;
    currency: TCurrency;
  };
};

export function useChampionshipPurchase({
  userId,
  returnUrl,
  payloadData: { currency, unitPrice, customer },
}: Params) {
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

    const description = `Покупка слотов в количестве ${quantity}шт. на создание чемпионатов на сайте bike-caucasus.ru`;

    //     Чтобы сформировать чек, создайте платеж  и передайте в запросе объект receipt с данными для чека: объект customer с электронной почтой пользователя или его номером телефона и массив items с данными о товарах или услугах (максимум 6 товаров).
    // Какие данные необходимо передать для каждого товара:
    // параметр description с названием товара или услуги;
    // параметр amount с суммой за единицу товара;
    // параметр quantity с указанием количества товара (только целые числа, например 1);
    // параметр vat_code с фиксированным значением 1 (стоимость без НДС).
    const receipt: IReceipt = {
      customer,
      items: [
        {
          description: 'Слот на создание чемпионата',
          quantity: String(quantity),
          amount: { value: String(unitPrice), currency },
          vat_code: 1,
        },
      ],
    };

    try {
      setIsLoading(true);
      const createPayload: TCreatePaymentWithMeta = {
        amount: {
          value: String(unitPrice * quantity),
          currency,
        },
        receipt,
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: returnUrl,
        },

        metadata: {
          userId,
          quantity,
          entityName: 'championship',
        },

        description,
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
