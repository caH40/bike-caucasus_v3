import { useEffect, useState } from 'react';

import { TRaceRegistrationDto, TRaceRegistrationRiderDto } from '@/types/dto.types';
import Select from '../../Select/Select';
import styles from './FormResultAdd.module.css';
import BoxInputSimple from '../../BoxInput/BoxInputSimple';

type Props = {
  registeredRiders: TRaceRegistrationDto[];
};

const getFullName = (rider: TRaceRegistrationRiderDto): string =>
  `${rider.firstName} ${rider.lastName}${rider.patronymic ? ' ' + rider.patronymic : ''}`;

/**
 * Форма добавления результата райдера в финишный Протокол.
 */
export default function FormResultAdd({ registeredRiders }: Props) {
  const [startNumber, setStartNumber] = useState<number>(0);
  const [fullName, setFullName] = useState<string | ''>('');
  const [newStartNumber, setNewStartNumber] = useState<number>(0);

  // Эффект для синхронизации startNumber и firstName
  useEffect(() => {
    if (startNumber !== 0) {
      const selectedRider = registeredRiders.find((elm) => elm.startNumber === +startNumber);

      if (selectedRider) {
        setFullName(getFullName(selectedRider.rider));
      }
    }
  }, [startNumber, registeredRiders]);

  useEffect(() => {
    if (fullName !== '') {
      const selectedRider = registeredRiders.find((elm) => getFullName(elm.rider) === fullName);
      if (selectedRider?.startNumber) {
        setStartNumber(selectedRider.startNumber);
      }
    }
  }, [fullName, registeredRiders]);

  // Создание массива опций для селекта райдера;
  const optionsStartNumber = registeredRiders.map((elm) => ({
    id: elm.rider.id,
    translation: String(elm.startNumber),
    name: String(elm.startNumber),
  }));

  // Создание массива опций для селекта райдера;
  const optionsRiderName = registeredRiders.map((elm) => ({
    id: elm.rider.id,
    translation: getFullName(elm.rider),
    name: getFullName(elm.rider),
  }));

  return (
    <form>
      <div className={styles.block__rider}>
        <div className={styles.box__startNumber}>
          <Select
            state={startNumber}
            setState={setStartNumber}
            name={'startNumber'}
            label={'Номер'}
            options={optionsStartNumber}
          />
        </div>

        <Select
          state={fullName}
          setState={setFullName}
          name={'fullName'}
          label={'Участник заезда'}
          options={optionsRiderName}
        />

        <div className={styles.box__startNumber_new}>
          <BoxInputSimple
            label="Изм. №"
            value={newStartNumber}
            handlerInput={setNewStartNumber}
            name={'newStartNumber'}
            type={'number'}
            id={'newStartNumber'}
            autoComplete="off"
            hideCheckmark={true}
          />
        </div>
        {/* <input
          className={styles.input}
          value={newStartNumber}
          onChange={(e) =>
            setNewStartNumber(typeof e.target.value === 'number' ? +e.target.value : 0)
          }
          type="number"
          name="newStartNumber"
          id="newStartNumber"
        /> */}
      </div>
    </form>
  );
}

// /**
//  * Форма добавления результата райдера в финишный Протокол.
//  */
// export default function FormResultAdd({ registeredRiders }: Props) {
//   const [riderName, setRiderName] = useState<string>('');
//   const [startNumber, setStartNumber] = useState<string>('0');

//   // Создание массива опций для селекта стартового номера;
//   const optionsStartNumbers = createOptionsStartNumbers(
//     registeredRiders.map((elm) => elm.startNumber || 0)
//   );

//   // Создание массива опций для селекта райдера;
//   const optionsRiderName = registeredRiders.map((elm, index) => ({
//     id: index,
//     translation: `${elm.rider.firstName} ${elm.rider.firstName}${
//       elm.rider.patronymic ? ' ' + elm.rider.patronymic : ''
//     }`,
//     name: elm._id,
//   }));

//   return (
//     <form className={styles.wrapper}>
//       <Select
//         state={startNumber}
//         setState={setStartNumber}
//         name={'startNumber'}
//         label={'Стартовый номер'}
//         options={optionsStartNumbers}
//       />
//       <Select
//         state={riderName}
//         setState={setRiderName}
//         name={'riderName'}
//         label={'Выбор райдера'}
//         options={optionsRiderName}
//       />
//     </form>
//   );
// }
