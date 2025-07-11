'use client';

import PurchaseSection from '@/components/UI/PurchaseSection/PurchaseSection';
import styles from './ChampionshipSlotPurchasePanel.module.css';

// types
import { TPriceTier } from '@/types/models.interface';
import { usePathname } from 'next/navigation';
import { useChampionshipPurchase } from '@/hooks/useChampionshipPurchase';

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
  const path = usePathname();

  // Простая логика получения данных по цене за товар и валюте.
  const { unitPrice, currency } = priceTier[0];

  const returnUrl = `${server}${path}`;
  const { handleClickPurchase, isLoading } = useChampionshipPurchase({
    returnUrl,
    unitPrice,
    currency,
    userId,
  });

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Количество доступных слотов для создания чемпионатов:</h3>
      <dl className={styles.list}>
        <dt className={styles.list__title}>Платные</dt>
        <dl className={styles.list__description}>{availableSlots?.purchasedAvailable} шт.</dl>

        <dt className={styles.list__title}>Тестовые</dt>
        <dl className={styles.list__description}>{availableSlots?.trialAvailable} шт.</dl>

        <dt className={styles.list__title}>Дополнительные</dt>
        <dl className={styles.list__description}>{availableSlots?.freeAvailable} шт.</dl>
      </dl>

      <p className={styles.description}>Стоимость 1 слота: {unitPrice}р</p>

      <PurchaseSection handleClickPurchase={handleClickPurchase} isLoading={isLoading} />
    </div>
  );
}
