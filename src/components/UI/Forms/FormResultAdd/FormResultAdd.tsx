import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAddResultRace } from '@/hooks/useAddResultRace';
import BlockInputsTime from './BlockInputsTime/BlockInputsTime';
import BlockInputsRegisteredRider from './BlockInputsRegisteredRider/BlockInputsRegisteredRider';
import Button from '../../Button/Button';
import { createStartNumbersOptions } from '@/libs/utils/championship/registration';
import { timeDetailsToMilliseconds } from '@/libs/utils/date';
import { useLoadingStore } from '@/store/loading';
import BlockSelectRegisteredRider from './BlockSelectRegisteredRider/BlockSelectRegisteredRider';
import { serializationResultRaceRider } from '@/libs/utils/serialization/resultRaceRider';
import FilterRidersForAddResult from '../../Filters/FilterRidersForAddResult/Filters';
import { buttonsForRiderRaceResult } from '@/constants/buttons';
import BlockSearchRider from './BlockSearchRider/BlockSearchRider';
import { useResetFormAddResultRace } from '@/hooks/useResetFormAddResultRace';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import styles from './FormResultAdd.module.css';

// types
import { TRaceRegistrationDto } from '@/types/dto.types';
import {
  ServerResponse,
  TFormResultRace,
  TGender,
  TGetStartNumbers,
  TOptions,
} from '@/types/index.interface';

type Props = {
  registeredRiders: TRaceRegistrationDto[];
  postRiderRaceResult: ({
    // eslint-disable-next-line no-unused-vars
    dataFromFormSerialized,
  }: {
    dataFromFormSerialized: FormData;
  }) => Promise<ServerResponse<void>>;
  championshipId: string;
  raceId: string;
  getCategoriesNameOptions: (gender: TGender) => TOptions[];
  startNumbersLists: TGetStartNumbers;
};

/**
 * Форма добавления результата райдера в Протокол заезда.
 */
export default function FormResultAdd({
  postRiderRaceResult,
  registeredRiders,
  raceId,
  championshipId,
  getCategoriesNameOptions,
  startNumbersLists,
}: Props) {
  const router = useRouter();
  const [startNumbersOptions, setStartNumbersOptions] = useState<TOptions[]>(
    createStartNumbersOptions(startNumbersLists.free)
  );

  const setLoading = useLoadingStore((state) => state.setLoading);
  const [activeIdBtn, setActiveIdBtn] = useState<number>(0);

  useEffect(() => {
    setStartNumbersOptions(createStartNumbersOptions(startNumbersLists.free));
  }, [startNumbersLists.free]);

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

  const gender = watch('rider.gender');

  // Формирование options названий категорий.
  const categoriesNameOptions = useMemo(
    () => getCategoriesNameOptions(gender),
    [gender, getCategoriesNameOptions]
  );

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
    reset,
    categorySkillLevelNames: categoriesNameOptions.map((c) => c.name),
    setStartNumbersOptions,
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
      raceId,
      championshipId,
      categoryName: dataFromForm.categoryName,
    });

    setLoading(true);
    const response = await postRiderRaceResult({ dataFromFormSerialized: dataSerialized });

    setLoading(false);

    if (response.ok) {
      reset();
      toast.success(response.message);
      router.refresh();
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
      <BlockInputsRegisteredRider
        register={register}
        errors={errors}
        startNumberRegisteredInRace={startNumberRegisteredInRace}
        startNumberOptions={startNumbersOptions}
        forCreate={true}
      />

      <div>
        <TitleAndLine hSize={3} title="Категория" />
        <BoxSelectNew
          label="Выбор категории:*"
          id="categoryName"
          options={categoriesNameOptions}
          register={register('categoryName', {
            required: 'Это обязательное поле для заполнения',
          })}
          validationText={errors.categoryName?.message || ''}
        />
      </div>

      {/* блок полей ввода финишного времени */}
      <BlockInputsTime register={register} errors={errors} />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={'Добавить'} theme="green" />
      </div>
    </form>
  );
}
