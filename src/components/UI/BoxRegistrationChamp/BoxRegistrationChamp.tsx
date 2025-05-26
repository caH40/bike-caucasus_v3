import ButtonLink from '../Button/ButtonLink';
import type { TChampionshipStatus, TChampionshipTypes } from '@/types/models.interface';

type Props = {
  status: TChampionshipStatus;
  type: TChampionshipTypes;
  urlSlugChamp: string;
};

/**
 * Отображение соответствующей кнопки-линка в зависимости от входных условий.
 */
export default function BoxRegistrationChamp({ type, status, urlSlugChamp }: Props) {
  const linkConfig = getLinkConfig(status, type, urlSlugChamp);

  return (
    <div>
      <ButtonLink
        href={linkConfig.href}
        theme={linkConfig.theme}
        name={linkConfig.name}
        disabled={linkConfig.disabled}
      />
    </div>
  );
}

/**
 * Функция для получения конфигурации линка на основе статуса.
 */
function getLinkConfig(
  status: TChampionshipStatus,
  type: TChampionshipTypes,
  urlSlugChamp: string
) {
  const isTourOrSeries = type === 'series' || type === 'tour';
  switch (status) {
    case 'upcoming':
      return {
        href: isTourOrSeries
          ? `/championships/${urlSlugChamp}`
          : `/championships/registration/${urlSlugChamp}`,
        theme: 'green',
        name: isTourOrSeries ? 'Подробнее' : 'Регистрация',
        disabled: false,
      };
    case 'cancelled':
      return {
        href: `/championships/${urlSlugChamp}`,
        theme: 'green',
        name: 'Отменён',
        disabled: true,
      };
    case 'ongoing':
      return {
        href: isTourOrSeries
          ? `/championships/${urlSlugChamp}`
          : `/championships/results/${urlSlugChamp}`,
        theme: 'green',
        name: isTourOrSeries ? 'Подробнее' : 'Результаты',
        // disabled: !isTourOrSeries,
      };
    default:
      return {
        href: `/championships/results/${urlSlugChamp}`,
        theme: 'dark-green',
        name: 'Результаты',
        disabled: false,
      };
  }
}
