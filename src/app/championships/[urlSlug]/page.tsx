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

import { getChampionship, getChampionships } from '@/actions/championship';
import BlockChampionshipHeader from '@/components/BlockChampionshipHeader/BlockChampionshipHeader';
import ChampionshipCard from '@/components/ChampionshipCard/ChampionshipCard';
import styles from './Championship.module.css';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

type Props = { params: { urlSlug: string } };

export default async function ChampionshipPage({ params: { urlSlug } }: Props) {
  // const championship = await getChampionship({ urlSlug });
  // const championships = await getChampionships({ needTypes: ['stage'] });

  const [championship, championships] = await Promise.all([
    getChampionship({ urlSlug }),
    getChampionships({ needTypes: ['stage'] }),
  ]);

  // console.log(championships);

  return (
    <div>
      {championship.data && (
        <>
          <div className={styles.block__header}>
            <BlockChampionshipHeader championship={championship.data} />
          </div>

          {['series', 'tour'].includes(championship.data.type) && (
            <>
              <TitleAndLine hSize={2} title="Этапы" />
              <div className={styles.wrapper__cards}>
                {championships.data &&
                  championships.data.map((champ) => (
                    <ChampionshipCard championship={champ} key={champ._id} simple={true} />
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
