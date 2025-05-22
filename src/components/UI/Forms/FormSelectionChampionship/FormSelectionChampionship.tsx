'use client';

import { useEffect, useState } from 'react';

import { TOptions } from '@/types/index.interface';
import SelectCustom from '../../SelectCustom/SelectCustom';
import { useRouter } from 'next/navigation';

type Props = {
  options: TOptions[];
  championshipsWithRacesIds: {
    urlSlug: string;
    races: string[];
  }[];
};

/**
 * Форма выбора Чемпионата и переход для добавления финишного протокола в него.
 */
export default function FormSelectionChampionship({
  options,
  championshipsWithRacesIds,
}: Props) {
  const router = useRouter();

  const [urlSlug, setUrlSlug] = useState<string>('');

  useEffect(() => {
    if (!urlSlug) {
      return;
    }
    const raceId = championshipsWithRacesIds.find((champ) => champ.urlSlug === urlSlug)
      ?.races[0];

    if (!raceId) {
      throw new Error('Не получен raceId!');
    }
    router.push(`/moderation/championship/protocol/${urlSlug}/${raceId}`);
  }, [urlSlug, championshipsWithRacesIds, router]);

  return (
    <form>
      <SelectCustom options={options} state={urlSlug} setState={setUrlSlug} />
    </form>
  );
}
