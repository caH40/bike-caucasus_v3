'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import BlockRaceInfo from '../BlockRaceInfo/BlockRaceInfo';
import FormResultAdd from '../UI/Forms/FormResultAdd/FormResultAdd';
import { getRegisteredRidersChamp } from '@/actions/registration-champ';
import ContainerProtocolRace from '../Table/Containers/ProtocolRace/ContainerProtocolRace';
import { getRaceProtocol } from '@/actions/result-race';
import { replaceCategorySymbols } from '@/libs/utils/championship/championship';
import { useResultsRace } from '@/store/results';
import RaceSelectButtons from '../UI/RaceSelectButtons/RaceSelectButtons';
import { createCategoryOptions } from '@/libs/utils/championship/registration';
import styles from './WrapperProtocolRaceEdit.module.css';

// types
import {
  ServerResponse,
  TCategoriesConfigNames,
  TGender,
  TGetStartNumbers,
} from '@/types/index.interface';
import { TDtoChampionship, TRaceRegistrationDto, TResultRaceDto } from '@/types/dto.types';

type Props = {
  championship: TDtoChampionship;
  postRiderRaceResult: ({
    // eslint-disable-next-line no-unused-vars
    dataFromFormSerialized,
  }: {
    dataFromFormSerialized: FormData;
  }) => Promise<ServerResponse<void>>;
  initialRaceId: string;
  startNumbersLists: TGetStartNumbers;
};

/**
 * Обертка для клиентских компонентов страницы работы с финишным протоколом Заезда.
 */
export default function WrapperProtocolRaceEdit({
  championship,
  postRiderRaceResult,
  initialRaceId,
  startNumbersLists,
}: Props) {
  const [raceId, setRaceId] = useState<string>(initialRaceId);
  const [registeredRiders, setRegisteredRiders] = useState<TRaceRegistrationDto[]>([]);
  const [protocol, setProtocol] = useState<TResultRaceDto[]>([]);
  const [categories, setCategories] = useState<TCategoriesConfigNames>({
    age: [],
    skillLevel: [],
  });
  const setTriggerResultTable = useResultsRace((state) => state.setTriggerResultTable);
  const triggerResultTable = useResultsRace((state) => state.triggerResultTable);

  const race = championship.races.find((race) => race._id === raceId);

  // Получение зарегистрированных участников в Заезде из БД.
  useEffect(() => {
    getRegisteredRidersChamp({ urlSlug: championship.urlSlug, raceId })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.message);
        }
        if (res.data) {
          // Берем 0 элемент, так как запрашиваем один конкретный заезд с номером raceNumber.
          setRegisteredRiders(res.data.champRegistrationRiders[0].raceRegistrationRider);
        }
      })
      .catch((error) => toast.error(error.message));
  }, [raceId, championship.urlSlug]);

  // Получение финишного протокола из БД.
  useEffect(() => {
    getRaceProtocol({ raceId }).then((res) => {
      if (res.data) {
        // Берем 0 элемент, так как запрашиваем один конкретный заезд с номером raceNumber.
        setProtocol(res.data.protocol);
        setCategories(res.data.categories);
      }
    });
  }, [raceId, triggerResultTable]);

  const raceInfo = {
    championshipId: championship._id,
    championshipUrlSlug: championship.urlSlug,
    raceId,
  };

  const getCategoriesNameOptions = (gender: TGender) => {
    const categoriesIdInRace = championship.races.find((r) => r._id === raceId)?.categories;
    const categoriesConfig = championship.categoriesConfigs.find(
      (c) => c._id === categoriesIdInRace
    );

    if (!categoriesIdInRace || !categoriesConfig) {
      return [{ id: 0, translation: 'Возрастная', name: 'Возрастная' }];
    }

    return createCategoryOptions(categoriesConfig, gender);
  };

  // Скрываемые столбцы в протоколах категорий.
  const hiddenColumnHeadersInCategoriesProtocol = [
    'Место в абсолюте',
    'Место в абсолюте по полу',
    'Отставания в общем протоколе',
    'Отставания в общей женской категории',
    'Категория',
    '#',
    championship.type === 'stage' ? 'Пусто' : 'Очки',
  ];

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

      <FormResultAdd
        postRiderRaceResult={postRiderRaceResult}
        registeredRiders={registeredRiders}
        championshipId={championship._id}
        raceId={raceId}
        setTriggerResultTable={setTriggerResultTable}
        getCategoriesNameOptions={getCategoriesNameOptions}
        startNumbersLists={startNumbersLists}
      />

      <ContainerProtocolRace
        protocol={protocol}
        raceInfo={raceInfo}
        hiddenColumnHeaders={[
          'Место в абсолюте по полу',
          'Место в категории',
          'Отставания в категории',
          'Отставания в общей женской категории',
          '#',
          'Очки',
        ]}
        captionTitle="Общий протокол"
      />

      {categories.age.map((category) => (
        <ContainerProtocolRace
          key={category}
          protocol={protocol.filter(
            (result) => result.categoryAge === category && !result.categorySkillLevel
          )}
          raceInfo={raceInfo}
          hiddenColumnHeaders={hiddenColumnHeadersInCategoriesProtocol}
          captionTitle={`Категория ${replaceCategorySymbols(category)}`}
        />
      ))}

      {categories.skillLevel.map((category) => (
        <ContainerProtocolRace
          key={category}
          protocol={protocol.filter((result) => result.categorySkillLevel === category)}
          raceInfo={raceInfo}
          hiddenColumnHeaders={hiddenColumnHeadersInCategoriesProtocol}
          captionTitle={`Категория ${replaceCategorySymbols(category)}`}
        />
      ))}
    </div>
  );
}
