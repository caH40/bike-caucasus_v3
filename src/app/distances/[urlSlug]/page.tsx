import dynamic from 'next/dynamic';

import { getDistance } from '@/actions/distance';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import styles from './Distance.module.css';
const MapWithElevation = dynamic(() => import('@/components/Map/MapWrapper'));

import DistanceParams from '@/components/DistanceParams/DistanceParams';

type Props = {
  params: Promise<{ urlSlug: string }>;
};

export default async function DistancePage(props: Props) {
  const { urlSlug } = await props.params;

  const { data: d, message, statusCode } = await getDistance(urlSlug);

  if (!d || !message) {
    return <ServerErrorMessage message={message} statusCode={statusCode} />;
  }

  console.log(d);

  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={1} title={`Дистанция: ${d.name}`} />

      <div className={styles.wrapper__params}>
        <DistanceParams distance={d} />
      </div>

      <MapWithElevation url={d.trackGPX.url} key={d._id} />
    </div>
  );
}
