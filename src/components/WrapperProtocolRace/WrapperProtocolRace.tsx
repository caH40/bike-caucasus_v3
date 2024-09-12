'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import BlockRaceInfo from '../BlockRaceInfo/BlockRaceInfo';
import ContainerProtocolRace from '../Table/Containers/ProtocolRace/ContainerProtocolRace';
import FormSelectionRace from '../UI/Forms/FormSelectionRace/FormSelectionRace';
import FilterRidersForAddResult from '../UI/Filters/FilterRidersForAddResult/Filters';
import { getProtocolRace, updateProtocolRace } from '@/actions/result-race';
import { replaceCategorySymbols } from '@/libs/utils/championship';
import { buttonsForProtocolRace } from '@/constants/buttons';
import type { TOptions } from '@/types/index.interface';
import type { TDtoChampionship, TResultRaceDto } from '@/types/dto.types';
import styles from './WrapperProtocolRace.module.css';

type Props = {
  options: TOptions[];
  championship: TDtoChampionship;
};

/**
 * Обертка для клиентских компонентов страницы результаты Заезда Чемпионата.
 */
export default function WrapperProtocolRace({ options, championship }: Props) {
  const [raceNumber, setRaceNumber] = useState<string>('1');
  const [protocol, setProtocol] = useState<TResultRaceDto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeIdBtn, setActiveIdBtn] = useState<number>(0);
  const [triggerResultTable, setTriggerResultTable] = useState<boolean>(false);

  const race = championship.races.find((race) => race.number === +raceNumber);

  // Получение финишного протокола из БД.
  useEffect(() => {
    getProtocolRace({ championshipId: championship._id, raceNumber: +raceNumber }).then(
      (res) => {
        if (res.data) {
          // Берем 0 элемент, так как запрашиваем один конкретный заезд с номером raceNumber.
          setProtocol(res.data.protocol);
          setCategories(res.data.categories);
        }
      }
    );
  }, [raceNumber, championship._id, triggerResultTable]);

  // Обработчик клика по иконки обновления, обновляет данные финишного протокола.
  const handlerUpdateProtocolRace = async () => {
    const championshipId = protocol[0]?.championship;
    const raceNumber = protocol[0]?.raceNumber;

    if (!championshipId || !raceNumber) {
      return toast.error('Нет данных об Чемпионате, или в протоколе нет ни одного результата!');
    }

    const response = await updateProtocolRace({
      championshipId,
      raceNumber,
    });

    if (response.ok) {
      toast.success(response.message);
      setTriggerResultTable((prev) => !prev);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <FormSelectionRace
        options={options}
        raceNumber={raceNumber}
        setRaceNumber={setRaceNumber}
        label={'Выбор заезда'}
      />

      <BlockRaceInfo raceNumber={raceNumber} race={race} />

      <FilterRidersForAddResult
        activeIdBtn={activeIdBtn}
        setActiveIdBtn={setActiveIdBtn}
        buttons={buttonsForProtocolRace}
      />

      {activeIdBtn === 0 ? (
        <>
          <ContainerProtocolRace
            protocol={protocol}
            handlerUpdateProtocolRace={handlerUpdateProtocolRace}
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
            handlerUpdateProtocolRace={handlerUpdateProtocolRace}
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
            handlerUpdateProtocolRace={handlerUpdateProtocolRace}
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
