import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import BlockInputsTime from './BlockInputsTime/BlockInputsTime';
import BlockInputs from './BlockInputs/BlockInputs';
import Button from '../../Button/Button';
import { millisecondsToTimeDetails, timeDetailsToMilliseconds } from '@/libs/utils/date';
import { useLoadingStore } from '@/store/loading';
import type { TResultRaceRiderDto } from '@/types/dto.types';
import type { ResponseServer, TFormResultRace } from '@/types/index.interface';
import styles from './FormResultAdd.module.css';

type Props = {
  result: TResultRaceRiderDto;
  putResultRaceRider: ({
    // eslint-disable-next-line no-unused-vars
    dataFromFormSerialized,
  }: {
    dataFromFormSerialized: FormData;
  }) => Promise<ResponseServer<void>>;
};

/**
 * Форма редактирования результата райдера.
 */
export default function FormResultEdit({ putResultRaceRider, result }: Props) {
  // const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormResultRace>({
    mode: 'all',
    defaultValues: {
      _id: result._id,
      newStartNumber: result.startNumber,
      rider: {
        firstName: result.profile.firstName,
        lastName: result.profile.lastName,
        patronymic: result.profile.patronymic,
        team: result.profile.team,
        city: result.profile.city,
        yearBirthday: result.profile.yearBirthday,
        gender: result.profile.gender,
      },
      time: millisecondsToTimeDetails(result.raceTimeInMilliseconds),
    },
  });

  const startNumberRegisteredInRace = watch('newStartNumber');

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormResultRace> = async (dataFromForm) => {
    const timeDetailsInMilliseconds = timeDetailsToMilliseconds(dataFromForm.time);
    console.log({ timeDetailsInMilliseconds, dataFromForm });
    const dataSerialized = {} as any;

    setLoading(true);
    const response = await putResultRaceRider({ dataFromFormSerialized: dataSerialized });

    setLoading(false);

    if (response.ok) {
      reset();
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      {/* блок полей ввода данных райдера */}
      <BlockInputs
        register={register}
        errors={errors}
        startNumberRegisteredInRace={+startNumberRegisteredInRace}
      />

      {/* блок полей ввода финишного времени */}
      <BlockInputsTime register={register} errors={errors} />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={'Обновить'} theme="green" />
      </div>
    </form>
  );
}
