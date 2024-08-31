import { SubmitHandler, useForm } from 'react-hook-form';

import { useAddResultRace } from '@/hooks/useAddResultRace';
import { TRaceRegistrationDto } from '@/types/dto.types';
import { ResponseServer, TFormResultRace } from '@/types/index.interface';
import BlockInputsTime from './BlockInputsTime/BlockInputsTime';
import BlockInputsRegisteredRider from './BlockInputsRegisteredRider/BlockInputsRegisteredRider';
import Button from '../../Button/Button';
import { timeDetailsToMilliseconds } from '@/libs/utils/date';
import { serializationResultRaceRider } from '@/libs/utils/serialization/resultRaceRider';
import styles from './FormResultAdd.module.css';
import { getFullName } from '@/libs/utils/text';
import { useLoadingStore } from '@/store/loading';

type Props = {
  registeredRiders: TRaceRegistrationDto[];
  postResultRaceRider: ({
    // eslint-disable-next-line no-unused-vars
    dataFromFormSerialized,
  }: {
    dataFromFormSerialized: FormData;
  }) => Promise<ResponseServer<void>>;
};

export default function FormResultAdd({ postResultRaceRider, registeredRiders }: Props) {
  console.log(registeredRiders);

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
      riderRegistered: {
        startNumber: 0,
        fullName: '',
        newStartNumber: 0,
      },
    },
  });

  const startNumber = watch('riderRegistered.startNumber');
  const fullName = watch('riderRegistered.fullName');

  // Синхронизация данных startNumber и fullName при их изменениях.
  useAddResultRace({ startNumber, registeredRiders, fullName, setValue });

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormResultRace> = async ({
    riderRegistered,
    riderFromDB,
    riderManual,
    time,
    target,
  }) => {
    const timeDetailsInMilliseconds = timeDetailsToMilliseconds(time);

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
      <BlockInputsRegisteredRider
        registeredRiders={registeredRiders}
        register={register}
        control={control}
        errors={errors}
      />

      <BlockInputsTime register={register} errors={errors} />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={'Добавить'} theme="green" />
      </div>
    </form>
  );
}
