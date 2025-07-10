import { Metadata } from 'next';

import PriceCard from '@/components/PriceCard/PriceCard';
import { getPrices } from '@/actions/price';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import { generateMetadataPrice } from '@/meta/meta';
import styles from './Price.module.css';

// Создание meta данных.
export const metadata: Metadata = generateMetadataPrice();

export default async function PricePage() {
  const priceTier = await getPrices();

  if (!priceTier.ok || !priceTier.data) {
    return <ServerErrorMessage message={priceTier.message} />;
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Прайс-лист</h1>
      <p className={styles.subheading}>Выберите подходящий тариф</p>
      <div className={styles.cardsWrapper}>
        {priceTier.data.map((service) => (
          <PriceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
}
