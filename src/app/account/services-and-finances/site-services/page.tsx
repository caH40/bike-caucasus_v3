import { getServerSession } from 'next-auth';

import ChampionshipSlotPurchasePanel from '@/components/SlotPurchasePanels/ChampionshipSlotPurchasePanel/ChampionshipSlotPurchasePanel';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import { getAvailableSlots } from '@/actions/slots';
import { getPriceTier } from '@/actions/price';
import styles from './SiteServicesPage.module.css';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import PermissionCheck from '@/hoc/permission-check';

/**
 * Приобретенные пользователем сервисы на сайте.
 */
export default async function SiteServicesPage() {
  const session = await getServerSession(authOptions);

  const { id, name, email, idDB } = session?.user || {};

  if (isNaN(Number(id)) || !idDB) {
    return <ServerErrorMessage message={'Не получен userId!'} />;
  }

  if (!email) {
    return (
      <ServerErrorMessage
        message={
          'Для продолжения работы необходимо указать email в вашем профиле. Пожалуйста, добавьте email-адрес.'
        }
      />
    );
  }

  const availableSlots = await getAvailableSlots({
    entityName: 'championship',
    userDBId: idDB,
  });

  if (!availableSlots.ok || !availableSlots.data) {
    return <ServerErrorMessage message={availableSlots.message} />;
  }

  const priceTier = await getPriceTier({ entityName: 'championship' });

  if (!priceTier.ok || !priceTier.data) {
    return <ServerErrorMessage message={priceTier.message} />;
  }

  return (
    <div className={styles.wrapper}>
      <TitleAndLine title="Платные сервисы сайта" hSize={1} />

      <PermissionCheck permission={'moderation.championship'}>
        <TitleAndLine title="Создание чемпионатов" hSize={2} />
        <ChampionshipSlotPurchasePanel
          user={{ userId: Number(id), fullName: `${name}`, email: email }}
          availableSlots={availableSlots.data.availableSlots}
          priceTier={priceTier.data.tiers}
        />
      </PermissionCheck>
    </div>
  );
}
