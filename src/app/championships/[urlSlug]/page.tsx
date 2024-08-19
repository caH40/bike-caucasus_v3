/**
 * Описание (обязательно: карта с местом старта)
 * Ссылка на зарегистрированных
 * Ссылка на результаты
 * !! Судьи и помощники в Чемпионате, для формирования итогового протокола Чемпионата
 */

import { getChampionship, getChampionships } from '@/actions/championship';
import BlockChampionshipHeader from '@/components/BlockChampionshipHeader/BlockChampionshipHeader';
import ChampionshipCard from '@/components/ChampionshipCard/ChampionshipCard';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { ChampionshipService } from '@/services/Championship';
import styles from './Championship.module.css';

type Props = { params: { urlSlug: string } };

/**
 * Страница описания Чемпионата как отдельного, так и серии заездов.
 */
export default async function ChampionshipPage({ params: { urlSlug } }: Props) {
  const [championship, championships] = await Promise.all([
    getChampionship({ urlSlug }),
    getChampionships({ needTypes: ['stage'] }),
  ]);
  const champService = new ChampionshipService();
  await champService.updateStatusChampionship();

  // !!! Продумать обработку или отображение ошибки.
  if (!championships.ok) {
    throw new Error(championships.message);
  }

  // Проверка наличия данных Этапов и их сортировка по возрастанию.
  const stages = championships.data
    ? championships.data.toSorted((a, b) => {
        if (!a.stage || !b.stage) {
          return 0;
        }
        return a.stage - b.stage;
      })
    : [];

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
                {stages.map((champ) => (
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
