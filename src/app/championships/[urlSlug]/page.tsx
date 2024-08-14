// Страница описания Чемпионата как отдельного, так и серии заездов.
/**
 * Название
 * Описание (обязательно: карта с местом старта)
 * Ссылка на регистрацию /championship/champName/registration
 * Ссылка на зарегистрированных
 * Ссылка на результаты
 * Лого и название Организатора
 * Ссылка на Родительскую страницу Чемпионата, если это один из Этапов
 * ССылки на Дочерние страницы Чемпионата, если родительски имеет несколько этапов
 *
 * !! Судьи и помощники в Чемпионате, для формирования итогового протокола Чемпионата
 *
 */

import { getChampionship } from '@/actions/championship';
import BlockChampionshipHeader from '@/components/BlockChampionshipHeader/BlockChampionshipHeader';

type Props = { params: { urlSlug: string } };

export default async function ChampionshipPage({ params: { urlSlug } }: Props) {
  const championship = await getChampionship({ urlSlug });

  // console.log(championship);

  return (
    <div>
      {championship.data && (
        <>
          <BlockChampionshipHeader championship={championship.data} />
        </>
      )}
    </div>
  );
}
