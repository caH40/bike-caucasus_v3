import styles from './PriceCard.module.css';
import { TSiteServicePriceDto } from '@/types/dto.types';

type Props = {
  service: TSiteServicePriceDto;
};
const championshipDescriptions = [
  '✔ Страница с описанием и GPS-треками',
  '✔ Онлайн-регистрация участников',
  '✔ Финишные протоколы (онлайн + PDF)',
  '✔ Поддержка одиночных гонок, туров и серий',
];

export default function PriceCard({ service }: Props) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        {service.entityName === 'championship'
          ? 'Организация чемпионатов по велоспорту'
          : 'Другая услуга'}
      </h2>

      <p className={styles.subtitle}>
        Покупка слота позволяет создавать динамические страницы для одного чемпионата. Ваши
        данные — наш функционал:
      </p>

      <ul className={styles.list}>
        {championshipDescriptions.map((c, key) => (
          <li className={styles.item} key={key}>
            {c}
          </li>
        ))}
      </ul>

      <table className={styles.priceTable}>
        <thead>
          <tr>
            <th>Количество</th>
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
