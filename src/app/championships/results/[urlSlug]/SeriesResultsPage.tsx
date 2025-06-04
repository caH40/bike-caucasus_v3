import GeneralClassificationWrapper from '@/components/GeneralClassificationWrapper/GeneralClassificationWrapper';
import { TDtoChampionship } from '@/types/dto.types';

type Props = {
  championship: TDtoChampionship;
};

/**
 * Страница генеральных результатов (таблиц) Серий и Туров.
 */
export default function SeriesResultsPage({ championship }: Props) {
  return <GeneralClassificationWrapper championship={championship} />;
}
