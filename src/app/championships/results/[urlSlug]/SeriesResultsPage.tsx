import GeneralClassificationWrapper from '@/components/GeneralClassificationWrapper/GeneralClassificationWrapper';
import { TDtoChampionship, TGeneralClassificationDto } from '@/types/dto.types';

type Props = {
  championship: TDtoChampionship;
  generalClassification: TGeneralClassificationDto[];
};

/**
 * Страница генеральных результатов (таблиц) Серий и Туров.
 */
export default function SeriesResultsPage({ championship, generalClassification }: Props) {
  console.log(generalClassification);

  return <GeneralClassificationWrapper championship={championship} />;
}
