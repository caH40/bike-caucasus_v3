import GeneralClassificationWrapper from '@/components/GeneralClassificationWrapper/GeneralClassificationWrapper';

import {
  TAwardedProtocols,
  TGetOneGeneralClassificationService,
} from '@/types/index.interface';

type Props = {
  gcFromServer: TGetOneGeneralClassificationService;
  awardedProtocols: TAwardedProtocols;
};

/**
 * Страница генеральных результатов (таблиц) Серий и Туров.
 */
export default function SeriesResultsPage({ gcFromServer, awardedProtocols }: Props) {
  return (
    <GeneralClassificationWrapper
      gcFromServer={gcFromServer}
      awardedProtocols={awardedProtocols}
    />
  );
}
