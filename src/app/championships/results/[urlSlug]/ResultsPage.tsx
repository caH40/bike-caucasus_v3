import RaceProtocolWrapper from '@/components/RaceProtocolWrapper/RaceProtocolWrapper';

import { TDtoChampionship } from '@/types/dto.types';

type Props = {
  championship: TDtoChampionship;
};

/**
 * Страница результатов (таблиц) соревнований (single) и этапов.
 */
export default function ResultsPage({ championship }: Props) {
  return (
    // Отображается только при наличии заезда(ов)
    championship.races.length > 0 && <RaceProtocolWrapper championship={championship} />
  );
}
