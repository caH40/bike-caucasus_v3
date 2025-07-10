'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import PurchaseSection from '@/components/UI/PurchaseSection/PurchaseSection';
import { createPayment } from '@/actions/payment';
import styles from './ChampionshipSlotPurchasePanel.module.css';

// types
import { TCreatePaymentWithMeta } from '@/types/index.interface';
import { TPriceTier } from '@/types/models.interface';

type Props = {
  userId: number; // id пользователя на сайте.
  availableSlots: {
    purchasedAvailable: number; // Количество доступных купленных слотов (которые ещё можно использовать).
    trialAvailable: number;
    freeAvailable: number;
  } | null;
  priceTier: TPriceTier[];
};

const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

/**
 * Панель состояния наличия слотов на создание чемпионатов и покупка слотов.
 */
export default function ChampionshipSlotPurchasePanel({
  userId,
  priceTier,
  availableSlots,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Простая логика получения данных по цене за товар и валюте.
  const { unitPrice, currency } = priceTier[0];

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
          return_url: server,
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

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Количество доступных слотов для создания чемпионатов:</h3>
      <dl className={styles.list}>
        <dt className={styles.list__title}>Купленных</dt>
        <dl className={styles.list__description}>{availableSlots?.purchasedAvailable} шт.</dl>

        <dt className={styles.list__title}>Пробных</dt>
        <dl className={styles.list__description}>{availableSlots?.trialAvailable} шт.</dl>

        <dt className={styles.list__title}>Бонусных</dt>
        <dl className={styles.list__description}>{availableSlots?.freeAvailable} шт.</dl>
      </dl>

      <p className={styles.description}>Стоимость 1 слота: {unitPrice}р</p>

      <PurchaseSection handleClickPurchase={handleClickPurchase} isLoading={isLoading} />
    </div>
  );
}
