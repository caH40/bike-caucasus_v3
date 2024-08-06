import { Metadata } from 'next';

import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { metadataChampionships } from '@/meta/meta';

// Создание meta данных.
export const metadata: Metadata = metadataChampionships;

/**
 * Страница с карточками предстоящих и завершившихся чемпионатов.
 */
export default async function ChampionshipsPage() {
  return (
    <>
      <TitleAndLine hSize={1} title="Чемпионаты по велоспорту" />
    </>
  );
}
