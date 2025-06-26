import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import IconDistance from '@/components/Icons/IconDistance';

/**
 * Страница со списком всех Дистанций.
 */
export default async function DistanceListPage() {
  return (
    <>
      <TitleAndLine
        hSize={1}
        title="Список Дистанций для заездов чемпионатов"
        Icon={IconDistance}
      />
    </>
  );
}
