'use client';

import { useEffect, useState } from 'react';

import { ServerResponse, TOptions } from '@/types/index.interface';
import FormSelectionRace from '../UI/Forms/FormSelectionRace/FormSelectionRace';
import { TDtoChampionship, TRaceRegistrationDto, TResultRaceDto } from '@/types/dto.types';
import BlockRaceInfo from '../BlockRaceInfo/BlockRaceInfo';
import styles from './WrapperProtocolRaceEdit.module.css';
import FormResultAdd from '../UI/Forms/FormResultAdd/FormResultAdd';
import { getRegisteredRidersChamp } from '@/actions/registration-champ';
import ContainerProtocolRace from '../Table/Containers/ProtocolRace/ContainerProtocolRace';
import { getRaceProtocol } from '@/actions/result-race';
import { replaceCategorySymbols } from '@/libs/utils/championship';
import { useResultsRace } from '@/store/results';
import { toast } from 'sonner';

type Props = {
  options: TOptions[];
  championship: TDtoChampionship;
  postRiderRaceResult: ({
    // eslint-disable-next-line no-unused-vars
    dataFromFormSerialized,
  }: {
    dataFromFormSerialized: FormData;
  }) => Promise<ServerResponse<void>>;
  initialRaceId: string;
};

/**
 * Обертка для клиентских компонентов страницы работы с финишным протоколом Заезда.
 */
export default function WrapperProtocolRaceEdit({
  options,
  championship,
  postRiderRaceResult,
  initialRaceId,
}: Props) {
  const [raceId, setRaceId] = useState<string>(initialRaceId);
  const [registeredRiders, setRegisteredRiders] = useState<TRaceRegistrationDto[]>([]);
  const [protocol, setProtocol] = useState<TResultRaceDto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
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

  return (
    <div className={styles.wrapper}>
      <FormSelectionRace
        options={options}
        raceId={raceId}
        setRaceId={setRaceId}
        label={'Выбор заезда для добавления результатов:'}
      />

      {race ? <BlockRaceInfo race={race} /> : <div>Не найден заезд</div>}

      <FormResultAdd
        postRiderRaceResult={postRiderRaceResult}
        registeredRiders={registeredRiders}
        championshipId={championship._id}
        raceId={raceId}
        setTriggerResultTable={setTriggerResultTable}
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
        ]}
        captionTitle="Общий протокол"
      />

      {categories.map((category) => (
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
          ]}
          captionTitle={`Категория ${replaceCategorySymbols(category)}`}
        />
      ))}
    </div>
  );
}
