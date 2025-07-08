'use client';

import { toast } from 'sonner';

import PurchaseSection from '@/components/UI/PurchaseSection/PurchaseSection';
import { ICreatePayment } from '@a2seven/yoo-checkout';
import { createPayment } from '@/actions/payment';

import styles from './ChampionshipSlotPurchasePanel.module.css';
import { useState } from 'react';

type Props = {
  userId: number; // id пользователя на сайте.
  availableSlots: number;
};

const pricePerChampionship = 1000;

/**
 * Панель состояния наличия слотов на создание чемпионатов и покупка слотов.
 */
export default function ChampionshipSlotPurchasePanel({ userId, availableSlots }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // getUserServiceAccessInfo(userId)

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
      const createPayload: ICreatePayment = {
        amount: {
          value: String(pricePerChampionship * quantity),
          currency: 'RUB',
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: 'http://localhost:3000',
        },
        metadata: {
          userId,
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
      toast.error(JSON.stringify(error));
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        Количество доступных слотов для создания чемпионатов {availableSlots} шт.
      </h3>
      <p className={styles.description}>Стоимость 1 слота: {pricePerChampionship}р</p>

      <PurchaseSection handleClickPurchase={handleClickPurchase} isLoading={isLoading} />
    </div>
  );
}
