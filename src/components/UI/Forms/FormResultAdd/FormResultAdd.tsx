import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAddResultRace } from '@/hooks/useAddResultRace';
import { createStartNumbersOptions } from '@/libs/utils/championship/registration';
import { buttonsForRiderRaceResult } from '@/constants/buttons';
import { useResetFormAddResultRace } from '@/hooks/useResetFormAddResultRace';
import { disqualificationOptions } from '@/constants/championship';
import { RACE_DISQUALIFICATION_LABELS } from '@/constants/translations';
import { useAddResultRaceSubmit } from '@/hooks/useAddResultRaceSubmit';
import BoxInput from '../../BoxInput/BoxInput';
import BlockInputsTime from './BlockInputsTime/BlockInputsTime';
import BlockInputsRegisteredRider from './BlockInputsRegisteredRider/BlockInputsRegisteredRider';
import Button from '../../Button/Button';
import BlockSelectRegisteredRider from './BlockSelectRegisteredRider/BlockSelectRegisteredRider';
import FilterRidersForAddResult from '../../Filters/FilterRidersForAddResult/Filters';
import BlockSearchRider from './BlockSearchRider/BlockSearchRider';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import styles from './FormResultAdd.module.css';

// types
import { TRaceRegistrationDto } from '@/types/dto.types';
import { TFormResultRace, TGender, TGetStartNumbers, TOptions } from '@/types/index.interface';

type Props = {
  registeredRiders: TRaceRegistrationDto[];
  championshipId: string;
  raceId: string;
  getCategoriesNameOptions: (gender: TGender) => TOptions[];
  startNumbersLists: TGetStartNumbers;
};

/**
 * Форма добавления результата райдера в Протокол заезда.
 */
export default function FormResultAdd({
  registeredRiders,
  raceId,
  championshipId,
  getCategoriesNameOptions,
  startNumbersLists,
}: Props) {
  const [startNumbersOptions, setStartNumbersOptions] = useState<TOptions[]>(
    createStartNumbersOptions(startNumbersLists.free)
  );

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
      disqualification: { type: undefined, comment: '' },
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
  const { onSubmit } = useAddResultRaceSubmit({ raceId, championshipId, reset });

  const dsqType = watch('disqualification.type');
  useEffect(() => {
    setValue(
      'disqualification.comment',
      dsqType === '' ? '' : RACE_DISQUALIFICATION_LABELS[dsqType]
    );
  }, [dsqType, setValue]);

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

      <div>
        <TitleAndLine hSize={3} title="Дисквалификация" />
        <div className={styles.wrapper__inputs}>
          <BoxSelectNew
            label="Выбор типа дисквалификации:"
            id="disqualification-type"
            options={disqualificationOptions}
            register={register('disqualification.type')}
          />

          <BoxInput
            label={'Комментарий:'}
            id="disqualification-comment"
            autoComplete="off"
            type="text"
            register={register('disqualification.comment', {
              maxLength: { value: 50, message: 'Не больше 50 символов' },
            })}
            validationText={errors.disqualification?.comment?.message}
            hasError={!!errors.disqualification?.comment?.message}
          />
        </div>
      </div>

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={'Добавить'} theme="green" />
      </div>
    </form>
  );
}
