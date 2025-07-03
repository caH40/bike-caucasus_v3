import { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { generateMetadataDistancesResults } from '@/meta/meta';
import { getDistance } from '@/actions/distance';
import { getDistanceResults } from '@/actions/distance-result';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
const MapWithElevation = dynamic(() => import('@/components/Map/MapWrapper'));
import DistanceParams from '@/components/DistanceParams/DistanceParams';
import Spacer from '@/components/Spacer/Spacer';
import DistanceResultsTableContainer from '@/components/Table/Containers/DistanceResultsTableContainer/DistanceResultsTableContainer';
import styles from './Distance.module.css';

// Создание динамических meta данных.
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataDistancesResults(props);
}

type Props = {
  params: Promise<{ urlSlug: string }>;
};

export default async function DistancePage(props: Props) {
  const { urlSlug } = await props.params;

  const { data: d, message, statusCode } = await getDistance(urlSlug);

  if (!d || !message) {
    return <ServerErrorMessage message={message} statusCode={statusCode} />;
  }

  //
  const distanceResults = await getDistanceResults(d._id);

  const distanceStats = d.stats && {
    uniqueRidersCount: d.stats.uniqueRidersCount,
    totalAttempts: d.stats.totalAttempts,
    lastResultsUpdate: d.stats.lastResultsUpdate,
  };
  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={1} title={d.name} />
      {/* Параметры дистанции */}
      <Spacer margin="b-lg">
        <DistanceParams distance={d} />
      </Spacer>

      <TitleAndLine hSize={2} title={'Таблица результатов на дистанции'} />

      {/* Таблица с результатами */}
      <Spacer margin="b-lg">
        {distanceResults.data ? (
          <DistanceResultsTableContainer
            distanceId={d._id}
            results={distanceResults.data}
            distanceStats={distanceStats}
          />
        ) : (
          <ServerErrorMessage
            message={distanceResults.message}
            statusCode={distanceResults.statusCode}
          />
        )}
      </Spacer>

      {/* Профиль дистанции и высоты с треком на карте */}
      <Spacer margin="b-lg">
        <MapWithElevation url={d.trackGPX.url} key={d._id} />
      </Spacer>
    </div>
  );
}
