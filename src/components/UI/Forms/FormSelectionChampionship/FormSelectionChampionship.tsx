'use client';

import { useEffect, useState } from 'react';

import { TOptions } from '@/types/index.interface';
import SelectCustom from '../../SelectCustom/SelectCustom';
import { useRouter } from 'next/navigation';

type Props = { options: TOptions[] };

/**
 * Форма выбора Чемпионата и переход для добавления финишного протокола в него.
 */
export default function FormSelectionChampionship({ options }: Props) {
  const router = useRouter();

  const [urlSlug, setUrlSlug] = useState<string>('');

  useEffect(() => {
    if (!urlSlug) {
      return;
    }

    router.push(`/moderation/championship/protocol/${urlSlug}`);
  }, [urlSlug, router]);

  return (
    <form>
      <SelectCustom options={options} state={urlSlug} setState={setUrlSlug} />
    </form>
  );
}
