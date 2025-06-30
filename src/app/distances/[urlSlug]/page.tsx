import dynamic from 'next/dynamic';

import { getDistance } from '@/actions/distance';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import styles from './Distance.module.css';
const MapWithElevation = dynamic(() => import('@/components/Map/MapWrapper'));
import JSONBlock from '@/components/JSONBlock/JSONBlock';

type Props = {
  params: Promise<{ urlSlug: string }>;
};

export default async function DistancePage(props: Props) {
  const { urlSlug } = await props.params;

  const { data: distance, message, statusCode } = await getDistance(urlSlug);

  if (!distance || !message) {
    return <ServerErrorMessage message={message} statusCode={statusCode} />;
  }

  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={1} title={`Дистанция: ${distance.name}`} />

      <JSONBlock json={distance} />

      <MapWithElevation url={distance.trackGPX.url} key={distance._id} />
    </div>
  );
}
