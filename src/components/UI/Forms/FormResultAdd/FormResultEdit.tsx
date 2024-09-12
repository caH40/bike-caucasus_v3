import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ResponseServer, TFormResultRaceEdit } from '@/types/index.interface';
import BlockInputsTime from './BlockInputsTime/BlockInputsTime';
import BlockInputs from './BlockInputs/BlockInputs';
import Button from '../../Button/Button';
import { timeDetailsToMilliseconds } from '@/libs/utils/date';
import { useLoadingStore } from '@/store/loading';

import styles from './FormResultAdd.module.css';

type Props = {
  result: any;
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
    control,
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormResultRaceEdit>({
    mode: 'all',
    defaultValues: {
      newStartNumber: 0,
      rider: {
        lastName: '',
      },
    },
  });

  // Сброс формы при переключении кнопок выбора способа ввода данных.
  useEffect(() => {}, []);

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormResultRaceEdit> = async (dataFromForm) => {
    const timeDetailsInMilliseconds = timeDetailsToMilliseconds(dataFromForm.time);
    console.log({ timeDetailsInMilliseconds, dataFromForm });

    // setLoading(true);
    // const response = await postResultRaceRider({ dataFromFormSerialized: dataSerialized });

    // setLoading(false);

    // if (response.ok) {
    //   reset();
    //   toast.success(response.message);
    //   setTriggerResultTable((prev) => !prev);
    // } else {
    //   toast.error(response.message);
    // }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
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
        <Button name={'Обновить'} theme="green" />
      </div>
    </form>
  );
}
