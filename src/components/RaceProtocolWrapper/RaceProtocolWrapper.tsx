'use client';

import { useEffect, useState } from 'react';

import BlockRaceInfo from '../BlockRaceInfo/BlockRaceInfo';
import ContainerProtocolRace from '../Table/Containers/ProtocolRace/ContainerProtocolRace';
import FilterRidersForAddResult from '../UI/Filters/FilterRidersForAddResult/Filters';
import { getRaceProtocol } from '@/actions/result-race';
import { replaceCategorySymbols } from '@/libs/utils/championship/championship';
import { buttonsForProtocolRace } from '@/constants/buttons';
import RaceSelectButtons from '../UI/RaceSelectButtons/RaceSelectButtons';
import styles from './RaceProtocolWrapper.module.css';

// types
import type { TDtoChampionship, TResultRaceDto } from '@/types/dto.types';
import { TCategoriesConfigNames } from '@/types/index.interface';

type Props = {
  championship: TDtoChampionship;
};

/**
 * Обертка для клиентских компонентов страницы результаты Заезда Чемпионата.
 */
export default function RaceProtocolWrapper({ championship }: Props) {
  const [raceId, setRaceId] = useState<string>(championship.races[0]._id);
  const [protocol, setProtocol] = useState<TResultRaceDto[]>([]);
  const [categories, setCategories] = useState<TCategoriesConfigNames>({
    age: [],
    skillLevel: [],
  });
  const [activeIdBtn, setActiveIdBtn] = useState<number>(0);

  const race = championship.races.find((race) => race._id === raceId);

  // Получение финишного протокола из БД.
  useEffect(() => {
    getRaceProtocol({ raceId }).then((res) => {
      if (res.data) {
        setProtocol(res.data.protocol);
        setCategories(res.data.categories);
      }
    });
  }, [raceId, championship._id]);

  const raceInfo = {
    championshipId: championship._id,
    championshipUrlSlug: championship.urlSlug,
    raceId,
  };

  // Скрываемые столбцы в протоколах категорий.
  const hiddenColumnHeadersInCategoriesProtocol = [
    'Место в абсолюте',
    'Место в абсолюте по полу',
    'Отставания в общем протоколе',
    'Отставания в общей женской категории',
    'Категория',
    '#',
    'Модерация',
    championship.type === 'stage' ? 'Пусто' : 'Очки',
  ];

  const raceProtocols: Record<number, JSX.Element[]> = {
    0: [
      <ContainerProtocolRace
        key={'overall'}
        protocol={protocol}
        raceInfo={raceInfo}
        hiddenColumnHeaders={[
          'Место в абсолюте по полу',
          'Место в категории',
          'Отставания в категории',
          'Отставания в общей женской категории',
          '#',
          'Модерация',
          'Очки',
        ]}
        captionTitle="Общий протокол"
        categoryEntity={'absolute'}
        moderatorIds={championship.moderatorIds}
      />,

      <ContainerProtocolRace
        key={'overallFemale'}
        protocol={protocol.filter((result) => result.profile.gender === 'female')}
        raceInfo={raceInfo}
        hiddenColumnHeaders={[
          'Место в абсолюте',
          'Место в категории',
          'Отставания в общем протоколе',
          'Отставания в категории',
          '#',
          'Модерация',
          'Очки',
        ]}
        captionTitle="Общий женский протокол"
        categoryEntity={'absoluteGender'}
        moderatorIds={championship.moderatorIds}
      />,
    ],
    1: categories.age.map((category) => (
      <ContainerProtocolRace
        key={category}
        protocol={protocol.filter(
          (result) => result.categoryAge === category && !result.categorySkillLevel
        )}
        raceInfo={raceInfo}
        hiddenColumnHeaders={hiddenColumnHeadersInCategoriesProtocol}
        captionTitle={`Категория ${replaceCategorySymbols(category)}`}
        categoryEntity={'category'}
        moderatorIds={championship.moderatorIds}
      />
    )),
    2: categories.skillLevel.map((category) => (
      <ContainerProtocolRace
        key={category}
        protocol={protocol.filter((result) => result.categorySkillLevel === category)}
        raceInfo={raceInfo}
        hiddenColumnHeaders={hiddenColumnHeadersInCategoriesProtocol}
        captionTitle={`Категория ${replaceCategorySymbols(category)}`}
        categoryEntity={'category'}
        moderatorIds={championship.moderatorIds}
      />
    )),
  };

  return (
    <div className={styles.wrapper}>
      <RaceSelectButtons
        races={championship.races.map((r) => ({
          name: r.name,
          id: r._id,
          description: r.description,
        }))}
        value={raceId}
        onChange={(id) => setRaceId(id)}
      />

      {race ? <BlockRaceInfo race={race} /> : <div>Не найден заезд</div>}

      {/* Кнопки переключения между разными типами финишных протоколов по категориям */}
      <FilterRidersForAddResult
        activeIdBtn={activeIdBtn}
        setActiveIdBtn={setActiveIdBtn}
        buttons={
          categories.skillLevel.length > 0
            ? buttonsForProtocolRace
            : buttonsForProtocolRace.slice(0, 2) // Удаляется кнопка skillLevel если нет категорий skillLevel.
        }
      />

      {/* Условная отрисовка компонента финишных протоколов в зависимости от активной кнопки фильтра */}
      {raceProtocols[activeIdBtn]}
    </div>
  );
}
