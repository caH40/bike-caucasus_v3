import { SubmitHandler, useForm } from 'react-hook-form';

import { useAddResultRace } from '@/hooks/useAddResultRace';
import { TRaceRegistrationDto } from '@/types/dto.types';
import { TFormResultRace } from '@/types/index.interface';

import styles from './FormResultAdd.module.css';
import BlockInputsTime from './BlockInputsTime/BlockInputsTime';

import BlockInputsRegisteredRider from './BlockInputsRegisteredRider/BlockInputsRegisteredRider';
import Button from '../../Button/Button';
import { timeDetailsToMilliseconds } from '@/libs/utils/date';
import { serializationResultRaceRider } from '@/libs/utils/serialization/resultRaceRider';

type Props = {
  registeredRiders: TRaceRegistrationDto[];
};

export default function FormResultAdd({ registeredRiders }: Props) {
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
  const onSubmit: SubmitHandler<TFormResultRace> = async (dataFromForm) => {
    const timeDetailsInMilliseconds = timeDetailsToMilliseconds(dataFromForm.time);

    const dataSerialized = serializationResultRaceRider({
      dataFromForm,
      timeDetailsInMilliseconds,
    });
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
