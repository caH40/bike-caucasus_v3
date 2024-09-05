import { SubmitHandler, useForm } from 'react-hook-form';

import { useAddResultRace } from '@/hooks/useAddResultRace';
import { TRaceRegistrationDto } from '@/types/dto.types';
import { ResponseServer, TFormResultRace } from '@/types/index.interface';
import BlockInputsTime from './BlockInputsTime/BlockInputsTime';
import BlockInputs from './BlockInputs/BlockInputs';
import Button from '../../Button/Button';
import { timeDetailsToMilliseconds } from '@/libs/utils/date';
// import { serializationResultRaceRider } from '@/libs/utils/serialization/resultRaceRider';
import styles from './FormResultAdd.module.css';

import { useLoadingStore } from '@/store/loading';
import BlockSelectRegisteredRider from './BlockSelectRegisteredRider/BlockSelectRegisteredRider';

type Props = {
  registeredRiders: TRaceRegistrationDto[];
  postResultRaceRider: ({
    // eslint-disable-next-line no-unused-vars
    dataFromFormSerialized,
  }: {
    dataFromFormSerialized: FormData;
  }) => Promise<ResponseServer<void>>;
};

/**
 * Форма добавления результата райдера в Протокол заезда.
 */
export default function FormResultAdd({ postResultRaceRider, registeredRiders }: Props) {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const {
    control,
    register,
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
  console.log(errors);

  // Стартовый номер у зарегистрированного в Заезде райдера.
  const startNumberRegisteredInRace = watch('riderRegisteredInRace.startNumber');
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
    const startNumber =
      dataFromForm.newStartNumber !== 0
        ? dataFromForm.newStartNumber
        : dataFromForm.riderRegisteredInRace.startNumber;

    console.log({ ...dataFromForm.rider, timeDetailsInMilliseconds, startNumber });

    // const dataSerialized = serializationResultRaceRider({
    //   ...(riderRegistered && { riderRegistered }),

    //   timeDetailsInMilliseconds,
    // });

    // setLoading(true);
    // await postResultRaceRider({ dataFromFormSerialized: dataSerialized });
    // setLoading(false);
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <BlockSelectRegisteredRider
        registeredRiders={registeredRiders}
        control={control}
        newStartNumber={newStartNumber}
      />

      <BlockInputs register={register} errors={errors} />

      <BlockInputsTime register={register} errors={errors} />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={'Добавить'} theme="green" />
      </div>
    </form>
  );
}
