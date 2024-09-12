'use client';

import { useEffect, useState } from 'react';

import { ResponseServer, TOptions } from '@/types/index.interface';
import FormSelectionRace from '../UI/Forms/FormSelectionRace/FormSelectionRace';
import { TDtoChampionship, TRaceRegistrationDto, TResultRaceDto } from '@/types/dto.types';
import BlockRaceInfo from '../BlockRaceInfo/BlockRaceInfo';
import styles from './WrapperProtocolRaceEdit.module.css';
import FormResultAdd from '../UI/Forms/FormResultAdd/FormResultAdd';
import { getRegisteredRidersChamp } from '@/actions/registration-champ';
import ContainerProtocolRace from '../Table/Containers/ProtocolRace/ContainerProtocolRace';
import { getProtocolRace } from '@/actions/result-race';
import { replaceCategorySymbols } from '@/libs/utils/championship';
import { useResultsRace } from '@/store/results';
import { toast } from 'sonner';

type Props = {
  options: TOptions[];
  championship: TDtoChampionship;
  postResultRaceRider: ({
    // eslint-disable-next-line no-unused-vars
    dataFromFormSerialized,
  }: {
    dataFromFormSerialized: FormData;
  }) => Promise<ResponseServer<void>>;
  initialRaceNumber: string;
};

/**
 * Обертка для клиентских компонентов страницы работы с финишным протоколом Заезда.
 */
export default function WrapperProtocolRaceEdit({
  options,
  championship,
  postResultRaceRider,
  initialRaceNumber,
}: Props) {
  const [raceNumber, setRaceNumber] = useState<string>(initialRaceNumber);
  const [registeredRiders, setRegisteredRiders] = useState<TRaceRegistrationDto[]>([]);
  const [protocol, setProtocol] = useState<TResultRaceDto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const setTriggerResultTable = useResultsRace((state) => state.setTriggerResultTable);
  const triggerResultTable = useResultsRace((state) => state.triggerResultTable);

  const race = championship.races.find((race) => race.number === +raceNumber);

  // Получение зарегистрированных участников в Заезде из БД.
  useEffect(() => {
    getRegisteredRidersChamp({ urlSlug: championship.urlSlug, raceNumber: +raceNumber })
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
  }, [raceNumber, championship.urlSlug]);

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

  return (
    <div className={styles.wrapper}>
      <FormSelectionRace
        options={options}
        raceNumber={raceNumber}
        setRaceNumber={setRaceNumber}
        label={'Выбор заезда для добавления результатов:'}
      />

      <BlockRaceInfo raceNumber={raceNumber} race={race} />

      <FormResultAdd
        postResultRaceRider={postResultRaceRider}
        registeredRiders={registeredRiders}
        championshipId={championship._id}
        raceNumber={raceNumber}
        setTriggerResultTable={setTriggerResultTable}
      />

      <ContainerProtocolRace
        protocol={protocol}
        raceInfo={{ championshipUrlSlug: championship.urlSlug, raceNumber: +raceNumber }}
        hiddenColumnHeaders={[
          'Место в абсолюте по полу',
          'Место в категории',
          'Отставания в категории',
          'Отставания в общей женской категории',
          '#',
        ]}
        captionTitle="Общий протокол"
      />

      {categories.map((category) => (
        <ContainerProtocolRace
          key={category}
          protocol={protocol.filter((result) => result.categoryAge === category)}
          raceInfo={{ championshipUrlSlug: championship.urlSlug, raceNumber: +raceNumber }}
          hiddenColumnHeaders={[
            'Место в абсолюте',
            'Место в абсолюте по полу',
            'Отставания в общем протоколе',
            'Отставания в общей женской категории',
            '#',
          ]}
          captionTitle={`Категория ${replaceCategorySymbols(category)}`}
        />
      ))}
    </div>
  );
}
