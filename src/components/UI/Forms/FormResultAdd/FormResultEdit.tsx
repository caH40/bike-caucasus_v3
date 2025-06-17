import { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import BlockInputsTime from './BlockInputsTime/BlockInputsTime';
import BlockInputsRegisteredRider from './BlockInputsRegisteredRider/BlockInputsRegisteredRider';
import Button from '../../Button/Button';
import { millisecondsToTimeDetails, timeDetailsToMilliseconds } from '@/libs/utils/date';
import { useLoadingStore } from '@/store/loading';
import { serializationResultRaceRider } from '@/libs/utils/serialization/resultRaceRider';
import type { TRiderRaceResultDto } from '@/types/dto.types';
import type {
  ServerResponse,
  TFormResultRace,
  TGetStartNumbers,
} from '@/types/index.interface';
import styles from './FormResultAdd.module.css';
import { useRouter } from 'next/navigation';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import BoxSelectNew from '../../BoxSelect/BoxSelectNew';

import { DEFAULT_AGE_NAME_CATEGORY } from '@/constants/category';
import {
  addStartNumberOption,
  createCategoryOptions,
  createStartNumbersOptions,
} from '@/libs/utils/championship/registration';

type Props = {
  result: TRiderRaceResultDto;
  putResultRaceRider: ({
    // eslint-disable-next-line no-unused-vars
    result,
  }: {
    result: FormData;
  }) => Promise<ServerResponse<void>>;
  startNumbersLists: TGetStartNumbers;
};

/**
 * Форма редактирования результата райдера.
 */
export default function FormResultEdit({
  putResultRaceRider,
  result,
  startNumbersLists,
}: Props) {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TFormResultRace>({
    mode: 'all',
    defaultValues: {
      _id: result._id,
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
      riderRegisteredInRace: {
        startNumber: result.startNumber,
      },
    },
  });

  const startNumberRegisteredInRace = watch('newStartNumber');

  const gender = watch('rider.gender');

  // Формирование options названий категорий.
  const categoriesNameOptions = useMemo(() => {
    if (!result.categoriesConfig) {
      return [{ id: 0, translation: 'Возрастная', name: 'Возрастная' }];
    }

    return createCategoryOptions(result.categoriesConfig, gender);
  }, [gender, result.categoriesConfig]);

  // Изменение поля categoryName.
  useEffect(() => {
    const categorySkillLevelNames = categoriesNameOptions.map((c) => c.name);

    setValue(
      'categoryName',
      result.categorySkillLevel && categorySkillLevelNames.includes(result.categorySkillLevel)
        ? result.categorySkillLevel
        : DEFAULT_AGE_NAME_CATEGORY
    );
  }, [categoriesNameOptions, setValue, result.categorySkillLevel]);

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormResultRace> = async (dataFromForm) => {
    const timeDetailsInMilliseconds = timeDetailsToMilliseconds(dataFromForm.time);

    // Сериализация данных для отправки на сервер.
    const dataSerialized = serializationResultRaceRider({
      timeDetailsInMilliseconds,
      ...dataFromForm.rider,
      startNumber: dataFromForm.riderRegisteredInRace.startNumber,
      resultId: dataFromForm._id,
      categoryName: dataFromForm.categoryName,
    });

    setLoading(true);
    const response = await putResultRaceRider({ result: dataSerialized });

    setLoading(false);

    if (response.ok) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const startNumbersOptions = addStartNumberOption(
    createStartNumbersOptions(startNumbersLists.free),
    result.startNumber
  );

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      {/* блок полей ввода данных райдера */}
      <BlockInputsRegisteredRider
        register={register}
        errors={errors}
        startNumberRegisteredInRace={+startNumberRegisteredInRace}
        startNumberOptions={startNumbersOptions}
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
        <Button
          getClick={() => router.back()}
          name={'Вернуться'}
          theme={'green'}
          type="button"
        />
        <Button name={'Обновить'} theme="green" />
      </div>
    </form>
  );
}
