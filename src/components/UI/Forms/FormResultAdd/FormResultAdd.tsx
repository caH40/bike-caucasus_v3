import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAddResultRace } from '@/hooks/useAddResultRace';
import { TRaceRegistrationDto } from '@/types/dto.types';
import { ResponseServer, TFormResultRace } from '@/types/index.interface';
import BlockInputsTime from './BlockInputsTime/BlockInputsTime';
import BlockInputs from './BlockInputs/BlockInputs';
import Button from '../../Button/Button';
import { timeDetailsToMilliseconds } from '@/libs/utils/date';
import { useLoadingStore } from '@/store/loading';
import BlockSelectRegisteredRider from './BlockSelectRegisteredRider/BlockSelectRegisteredRider';
import { serializationResultRaceRider } from '@/libs/utils/serialization/resultRaceRider';
import FilterRidersForAddResult from '../../Filters/FilterRidersForAddResult/Filters';
import { buttonsForRiderRaceResult } from '@/constants/buttons';
import BlockSearchRider from './BlockSearchRider/BlockSearchRider';
import styles from './FormResultAdd.module.css';
import { useResetFormAddResultRace } from '@/hooks/useResetFormAddResultRace';

type Props = {
  registeredRiders: TRaceRegistrationDto[];
  postResultRaceRider: ({
    // eslint-disable-next-line no-unused-vars
    dataFromFormSerialized,
  }: {
    dataFromFormSerialized: FormData;
  }) => Promise<ResponseServer<void>>;
  championshipId: string;
  raceNumber: string;
  setTriggerResultTable: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Форма добавления результата райдера в Протокол заезда.
 */
export default function FormResultAdd({
  postResultRaceRider,
  registeredRiders,
  raceNumber,
  championshipId,
  setTriggerResultTable,
}: Props) {
  // const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [activeIdBtn, setActiveIdBtn] = useState<number>(0);

  // Название активной кнопки для отображения соответствующих полей ввода в форме.
  const nameBtnFilter = buttonsForRiderRaceResult.find(
    (button) => button.id === activeIdBtn
  )?.name;

  const {
    control,
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormResultRace>({
    mode: 'all',
    defaultValues: {
      riderRegisteredInRace: { startNumber: 0 },
      newStartNumber: 0,
      rider: {
        lastName: '',
      },
    },
  });

  // Сброс формы при переключении кнопок выбора способа ввода данных.
  useResetFormAddResultRace({ setValue, activeIdBtn });

  // Стартовый номер у зарегистрированного в Заезде райдера.
  const startNumberRegisteredInRace = watch('riderRegisteredInRace.startNumber');
  // console.log({ startNumberRegisteredInRace });

  // Фамилия у зарегистрированного в Заезде райдера.
  const lastNameRegisteredInRace = watch('riderRegisteredInRace.lastName');
  // Измененный стартовый номер.
  const newStartNumber = watch('newStartNumber');

  // Синхронизация данных startNumber и fullName при их изменениях.
  useAddResultRace({
    startNumberRegisteredInRace,
    registeredRiders,
    lastNameRegisteredInRace,
    setValue,
  });

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormResultRace> = async (dataFromForm) => {
    const timeDetailsInMilliseconds = timeDetailsToMilliseconds(dataFromForm.time);

    // Получение стартового номера.
    const startNumber = () => {
      // Если введен новый номер, значит он используется как стартовый номер.
      if (!!dataFromForm.newStartNumber && +dataFromForm.newStartNumber !== 0) {
        return +dataFromForm.newStartNumber;
      }

      return +dataFromForm.riderRegisteredInRace.startNumber;
    };

    const dataSerialized = serializationResultRaceRider({
      ...dataFromForm.rider,
      timeDetailsInMilliseconds,
      startNumber: startNumber(),
      raceNumber,
      championshipId,
    });

    setLoading(true);
    const response = await postResultRaceRider({ dataFromFormSerialized: dataSerialized });

    setLoading(false);

    if (response.ok) {
      reset();
      toast.success(response.message);
      setTriggerResultTable((prev) => !prev);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      {/* Выбор способа ввода данных */}
      <FilterRidersForAddResult
        buttons={buttonsForRiderRaceResult}
        activeIdBtn={activeIdBtn}
        setActiveIdBtn={setActiveIdBtn}
      />

      {/* блок выбора Райдера из списка зарегистрированных */}
      {nameBtnFilter === 'registered' && (
        <BlockSelectRegisteredRider
          registeredRiders={registeredRiders}
          control={control}
          newStartNumber={newStartNumber}
        />
      )}

      {/* блок поиска Райдера в БД сайта */}
      {nameBtnFilter === 'search' && <BlockSearchRider setValue={setValue} />}

      {/* блок полей ввода данных райдера */}
      <BlockInputs
        register={register}
        errors={errors}
        startNumberRegisteredInRace={startNumberRegisteredInRace}
      />

      {/* блок полей ввода финишного времени */}
      <BlockInputsTime register={register} errors={errors} />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={'Добавить'} theme="green" />
      </div>
    </form>
  );
}
