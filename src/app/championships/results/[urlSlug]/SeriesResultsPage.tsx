import GeneralClassificationWrapper from '@/components/GeneralClassificationWrapper/GeneralClassificationWrapper';

import { TGetOneGeneralClassificationService } from '@/types/index.interface';

type Props = {
  gcFromServer: TGetOneGeneralClassificationService;
};

/**
 * Страница генеральных результатов (таблиц) Серий и Туров.
 */
export default function SeriesResultsPage({ gcFromServer }: Props) {
  return <GeneralClassificationWrapper gcFromServer={gcFromServer} />;
}
