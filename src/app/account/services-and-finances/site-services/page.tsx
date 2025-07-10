import { getServerSession } from 'next-auth';

import ChampionshipSlotPurchasePanel from '@/components/SlotPurchasePanels/ChampionshipSlotPurchasePanel/ChampionshipSlotPurchasePanel';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import { getAvailableSlots } from '@/actions/slots';
import { getPriceTier } from '@/actions/price';
import styles from './SiteServicesPage.module.css';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

/**
 * Приобретенные пользователем сервисы на сайте.
 */
export default async function SiteServicesPage() {
  const session = await getServerSession(authOptions);

  const userId = Number(session?.user.id);
  const userDBId = session?.user.idDB;

  if (!userId || isNaN(userId) || !userDBId) {
    return <ServerErrorMessage message={'Не получен userId!'} />;
  }

  const availableSlots = await getAvailableSlots({ entityName: 'championship', userDBId });

  if (!availableSlots.ok || !availableSlots.data) {
    return <ServerErrorMessage message={availableSlots.message} />;
  }

  const priceTier = await getPriceTier({ entityName: 'championship' });

  if (!priceTier.ok || !priceTier.data) {
    return <ServerErrorMessage message={priceTier.message} />;
  }

  return (
    <div className={styles.wrapper}>
      <TitleAndLine title="Платны сервисы сайта" hSize={1} />

      <TitleAndLine title="Создание чемпионатов" hSize={2} />
      <ChampionshipSlotPurchasePanel
        userId={userId}
        availableSlots={availableSlots.data.availableSlots}
        priceTier={priceTier.data.tiers}
      />
    </div>
  );
}
