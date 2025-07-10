/**
 * Слоты на соревнования.
 */

import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import UnderConstruction from '@/components/UnderConstruction/UnderConstruction';

/**
 * Приобретенные слоты на соревнования.
 */
export default function CompetitionSlotsPage() {
  return (
    <div>
      <TitleAndLine title="Приобретенные слоты на соревнования" hSize={1} />

      <UnderConstruction />
    </div>
  );
}
