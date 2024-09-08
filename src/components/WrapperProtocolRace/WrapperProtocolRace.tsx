'use client';

import { useEffect, useState } from 'react';

import { ResponseServer, TOptions } from '@/types/index.interface';
import FormSelectionRace from '../UI/Forms/FormSelectionRace/FormSelectionRace';
import { TDtoChampionship, TRaceRegistrationDto, TResultRaceDto } from '@/types/dto.types';
import BlockRaceInfo from '../BlockRaceInfo/BlockRaceInfo';
import styles from './WrapperProtocolRace.module.css';
import FormResultAdd from '../UI/Forms/FormResultAdd/FormResultAdd';
import { getRegisteredRidersChamp } from '@/actions/registration-champ';
import ContainerProtocolRace from '../Table/Containers/ProtocolRace/ContainerProtocolRace';
import { getProtocolRace, updateProtocolRace } from '@/actions/result-race';
import { toast } from 'sonner';
import { replaceCategorySymbols } from '@/libs/utils/championship';

type Props = {
  options: TOptions[];
  championship: TDtoChampionship;
  postResultRaceRider: ({
    // eslint-disable-next-line no-unused-vars
    dataFromFormSerialized,
  }: {
    dataFromFormSerialized: FormData;
  }) => Promise<ResponseServer<void>>;
};

/**
 * Обертка для клиентских компонентов страницы работы с финишным протоколом Заезда.
 */
export default function WrapperProtocolRace({
  options,
  championship,
  postResultRaceRider,
}: Props) {
  const [raceNumber, setRaceNumber] = useState<string>('1');
  const [registeredRiders, setRegisteredRiders] = useState<TRaceRegistrationDto[]>([]);
  const [protocol, setProtocol] = useState<TResultRaceDto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [triggerResultTable, setTriggerResultTable] = useState<boolean>(false);

  const race = championship.races.find((race) => race.number === +raceNumber);

  // Получение зарегистрированных участников в Заезде из БД.
  useEffect(() => {
    getRegisteredRidersChamp({ urlSlug: championship.urlSlug, raceNumber: +raceNumber }).then(
      (res) => {
        if (res.data) {
          // Берем 0 элемент, так как запрашиваем один конкретный заезд с номером raceNumber.
          setRegisteredRiders(res.data.champRegistrationRiders[0].raceRegistrationRider);
        }
      }
    );
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
        handlerUpdateProtocolRace={handlerUpdateProtocolRace}
        hiddenColumnHeaders={['Место в абсолюте по полу', 'Место в категории', '#']}
        captionTitle="Абсолютный протокол"
      />

      {categories.map((category) => (
        <ContainerProtocolRace
          key={category}
          protocol={protocol.filter((result) => result.categoryAge === category)}
          handlerUpdateProtocolRace={handlerUpdateProtocolRace}
          hiddenColumnHeaders={['Место в абсолюте', 'Место в абсолюте по полу', '#']}
          captionTitle={`Категория ${replaceCategorySymbols(category)}`}
        />
      ))}
    </div>
  );
}
