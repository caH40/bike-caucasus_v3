'use client';

import { useAd } from '@/hooks/useAd';
import { adBlocks } from '../../yandex/blocks';
import styles from './AdContainer.module.css';

type Props = {
  adsNumber: number;
  marginBottom?: number;
  height?: string | number;
  maxHeight?: string | number;
  maxWidth?: string | number;
};

/**
 * Контейнер для блока рекламы.
 *
 * @param {number} number - Идентификатор рекламного блока.
 * @param {number} [marginBottom=0] - Нижний отступ контейнера.
 * @param {string} [height='auto'] - Высота контейнера.
 * @param {string} [maxHeight='none'] - Максимальная высота контейнера.
 * @param {string} [maxWidth='none'] - Максимальная ширина контейнера.
 */
export default function AdContainer({
  adsNumber,
  marginBottom = 0,
  height = 'auto',
  maxHeight = 'none',
  maxWidth = 'none',
}: Props) {
  useAd(adsNumber);
  // Поиск рекламного блока по идентификатору.
  const adBlock = adBlocks.find((block) => block.id === adsNumber)?.label;

  // Если рекламный блок найден, создаем контейнер для рекламы с соответствующими стилями и id.
  return adBlock ? (
    <div
      className={styles.block}
      style={{ marginBottom, maxHeight, maxWidth, height }}
      id={`yandex_rtb_${adBlock}`}
    >
      <div className={styles.test} />
    </div>
  ) : null;
}
