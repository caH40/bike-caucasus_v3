import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import IconDistance from '@/components/Icons/IconDistance';
import { getAllDistances } from '@/actions/distance';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import DistanceTableContainer from '@/components/Table/Containers/DistanceTableContainer/DistanceTableContainer';

/**
 * Страница со списком всех Дистанций.
 */
export default async function DistanceListPage() {
  const distances = await getAllDistances();

  if (!distances.ok || !distances.data) {
    return <ServerErrorMessage message={distances.message} statusCode={distances.statusCode} />;
  }

  return (
    <>
      <TitleAndLine
        hSize={1}
        title="Список Дистанций для заездов чемпионатов"
        Icon={IconDistance}
      />

      <DistanceTableContainer distances={distances.data} />
    </>
  );
}
