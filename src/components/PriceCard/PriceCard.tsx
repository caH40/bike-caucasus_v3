import styles from './PriceCard.module.css';
import { TSiteServicePriceDto } from '@/types/dto.types';

type Props = {
  service: TSiteServicePriceDto;
};

export default function PriceCard({ service }: Props) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        {service.entityName === 'championship'
          ? 'Организация чемпионатов по велоспорту'
          : 'Другая услуга'}
      </h2>

      <table className={styles.priceTable}>
        <thead>
          <tr>
            <th>Кол-во</th>
            <th>Цена за единицу</th>
          </tr>
        </thead>
        <tbody>
          {service.tiers.map((tier, idx) => (
            <tr key={idx}>
              <td>
                {tier.quantityRange.min}–{tier.quantityRange.max}
              </td>
              <td>{tier.unitPrice.toLocaleString('ru-RU')} ₽</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
