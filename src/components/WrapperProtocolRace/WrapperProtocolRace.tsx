'use client';

import { useEffect, useState } from 'react';

import BlockRaceInfo from '../BlockRaceInfo/BlockRaceInfo';
import ContainerProtocolRace from '../Table/Containers/ProtocolRace/ContainerProtocolRace';
import FormSelectionRace from '../UI/Forms/FormSelectionRace/FormSelectionRace';
import FilterRidersForAddResult from '../UI/Filters/FilterRidersForAddResult/Filters';
import { getRaceProtocol } from '@/actions/result-race';
import { replaceCategorySymbols } from '@/libs/utils/championship';
import { buttonsForProtocolRace } from '@/constants/buttons';
import type { TOptions } from '@/types/index.interface';
import type { TDtoChampionship, TResultRaceDto } from '@/types/dto.types';
import styles from './WrapperProtocolRace.module.css';
import { useResultsRace } from '@/store/results';

type Props = {
  options: TOptions[];
  championship: TDtoChampionship;
};

/**
 * Обертка для клиентских компонентов страницы результаты Заезда Чемпионата.
 */
export default function WrapperProtocolRace({ options, championship }: Props) {
  const [raceId, setRaceId] = useState<string>(championship.races[0]._id);
  const [protocol, setProtocol] = useState<TResultRaceDto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeIdBtn, setActiveIdBtn] = useState<number>(0);
  // const [triggerResultTable, setTriggerResultTable] = useState<boolean>(false);
  const triggerResultTable = useResultsRace((state) => state.triggerResultTable);

  const race = championship.races.find((race) => race._id === raceId);

  // Получение финишного протокола из БД.
  useEffect(() => {
    getRaceProtocol({ raceId }).then((res) => {
      if (res.data) {
        // Берем 0 элемент, так как запрашиваем один конкретный заезд с номером raceNumber.
        setProtocol(res.data.protocol);
        setCategories(res.data.categories);
      }
    });
  }, [raceId, championship._id, triggerResultTable]);

  const raceInfo = {
    championshipId: championship._id,
    championshipUrlSlug: championship.urlSlug,
    raceId,
  };

  return (
    <div className={styles.wrapper}>
      <FormSelectionRace
        options={options}
        raceId={raceId}
        setRaceId={setRaceId}
        label={'Выбор заезда'}
      />

      {race ? <BlockRaceInfo race={race} /> : <div>Не найден заезд</div>}

      <FilterRidersForAddResult
        activeIdBtn={activeIdBtn}
        setActiveIdBtn={setActiveIdBtn}
        buttons={buttonsForProtocolRace}
      />

      {activeIdBtn === 0 ? (
        <>
          <ContainerProtocolRace
            protocol={protocol}
            raceInfo={raceInfo}
            hiddenColumnHeaders={[
              'Место в абсолюте по полу',
              'Место в категории',
              'Отставания в категории',
              'Отставания в общей женской категории',
              '#',
              'Модерация',
            ]}
            captionTitle="Общий протокол"
          />

          <ContainerProtocolRace
            protocol={protocol.filter((result) => result.profile.gender === 'female')}
            raceInfo={raceInfo}
            hiddenColumnHeaders={[
              'Место в абсолюте',
              'Место в категории',
              'Отставания в общем протоколе',
              'Отставания в категории',
              '#',
              'Модерация',
            ]}
            captionTitle="Общий женский протокол"
          />
        </>
      ) : (
        categories.map((category) => (
          <ContainerProtocolRace
            key={category}
            protocol={protocol.filter((result) => result.categoryAge === category)}
            raceInfo={raceInfo}
            hiddenColumnHeaders={[
              'Место в абсолюте',
              'Место в абсолюте по полу',
              'Отставания в общем протоколе',
              'Отставания в общей женской категории',
              '#',
              'Модерация',
            ]}
            captionTitle={`Категория ${replaceCategorySymbols(category)}`}
          />
        ))
      )}
    </div>
  );
}
