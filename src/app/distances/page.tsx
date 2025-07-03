import { Metadata } from 'next';

import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { getAllDistances } from '@/actions/distance';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import DistanceTableContainer from '@/components/Table/Containers/DistanceTableContainer/DistanceTableContainer';
import { metadataDistances } from '@/meta/meta';

// Создание meta данных.
export const metadata: Metadata = metadataDistances;

export default async function DistancesPage() {
  const distances = await getAllDistances();

  if (!distances.data || !distances.message) {
    return <ServerErrorMessage message={distances.message} statusCode={distances.statusCode} />;
  }

  return (
    <>
      <TitleAndLine hSize={1} title="Дистанции для соревнований" />

      <DistanceTableContainer distances={distances.data} />
    </>
  );
}
