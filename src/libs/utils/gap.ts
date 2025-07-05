import { TGap } from '@/types/models.interface';

type Params<T> = {
  results: T[];
  getTime: (result: T) => number;
};

/**
 * Функция устанавливает отставания от лидера и от впереди финишировавшего райдера.
 */
export function setResultGaps<T>({
  results,
  getTime,
}: Params<T>): (T & { currentGaps: TGap })[] {
  return results.map((result, index) => {
    const toLeader = index === 0 ? null : getTime(result) - getTime(results[0]);
    const toPrev = index === 0 ? null : getTime(result) - getTime(results[index - 1]);

    return { ...result, currentGaps: { toLeader, toPrev } };
  });
}
