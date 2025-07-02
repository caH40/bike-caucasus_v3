import dynamic from 'next/dynamic';

import { getDistance } from '@/actions/distance';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import styles from './Distance.module.css';
const MapWithElevation = dynamic(() => import('@/components/Map/MapWrapper'));

import DistanceParams from '@/components/DistanceParams/DistanceParams';
import Spacer from '@/components/Spacer/Spacer';
import UnderConstruction from '@/components/UnderConstruction/UnderConstruction';
import { getDistanceResults, putDistanceResults } from '@/actions/distance-result';

type Props = {
  params: Promise<{ urlSlug: string }>;
};

export default async function DistancePage(props: Props) {
  const { urlSlug } = await props.params;

  const { data: d, message, statusCode } = await getDistance(urlSlug);

  if (!d || !message) {
    return <ServerErrorMessage message={message} statusCode={statusCode} />;
  }

  // await putDistanceResults(d._id);
  const results = await getDistanceResults(d._id);
  console.log(results);

  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={1} title={d.name} />

      {/* Параметры дистанции */}
      <Spacer margin="b-md">
        <DistanceParams distance={d} />
      </Spacer>

      {/* Профиль дистанции и высоты с треком на карте */}
      <Spacer margin="b-lg">
        <MapWithElevation url={d.trackGPX.url} key={d._id} />
      </Spacer>

      <TitleAndLine hSize={2} title={'Таблица результатов на дистанции'} />

      <UnderConstruction />
    </div>
  );
}
