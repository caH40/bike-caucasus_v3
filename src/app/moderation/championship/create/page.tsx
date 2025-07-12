import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconChampionship from '@/components/Icons/IconChampionship';

import { getToursAndSeries } from '@/actions/championship';
import { getOrganizerForModerate } from '@/actions/organizer';
import t from '@/locales/ru/moderation/championship.json';

import CContainerChampionshipForms from '@/components/ClientContainers/CContainerChampionshipForms/CContainerChampionshipForms';
import { getRacePointsTables } from '@/actions/race-points-table';
import { getAllDistances } from '@/actions/distance';
import { getAvailableSlots } from '@/actions/slots';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { isValidElement } from 'react';
import { handleServerResponse } from '@/libs/utils/handleServerResponse';

export const dynamic = 'force-dynamic';

/**
 * Страница создания Чемпионатов.
 */
export default async function ChampionshipCreatePage() {
  const session = await getServerSession(authOptions);
  const { idDB } = session?.user || {};

  if (!idDB) {
    return <ServerErrorMessage message={'Не получен idDB!'} />;
  }

  // Данные об слотах для создания чемпионата.
  const availableSlotsRes = await getAvailableSlots({
    entityName: 'championship',
    userDBId: idDB,
  });

  const availableSlots = handleServerResponse(availableSlotsRes);
  if (isValidElement(availableSlots)) {
    return availableSlots;
  }

  // Если нет слотов для создания чемпионатов то отображать ошибку.
  if (availableSlotsRes.data?.availableSlots?.totalAvailable === 0) {
    return (
      <ServerErrorMessage message={'У вас нет доступных слотов для создания чемпионата!'} />
    );
  }

  const [{ data: organizer }, racePointsTables, distances] = await Promise.all([
    getOrganizerForModerate(),
    getRacePointsTables(),
    getAllDistances(),
  ]);

  if (!organizer) {
    return <h1>{t.notFoundOrganizer}</h1>;
  }

  const parentChampionships = await getToursAndSeries({ organizerId: organizer._id });

  return (
    <>
      <TitleAndLine title={t.titleCreate} hSize={1} Icon={IconChampionship} />

      <CContainerChampionshipForms
        organizer={organizer}
        parentChampionships={parentChampionships.data || []}
        racePointsTables={racePointsTables?.data || []}
        distances={distances.data || []}
      />
    </>
  );
}
