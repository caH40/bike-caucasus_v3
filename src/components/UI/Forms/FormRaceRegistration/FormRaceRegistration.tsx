'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useMemo } from 'react';

import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import Button from '../../Button/Button';
import BoxInput from '../../BoxInput/BoxInput';
import {
  createCategoryOptions,
  createOptionsRaces,
} from '@/app/championships/registration/[urlSlug]/utils';
import { useLoadingStore } from '@/store/loading';
import { registerForChampionship } from '@/actions/registration-champ';
import { useRegistrationRace } from '@/store/registration-race';
import { useRegisteredRiders } from '@/hooks/useRegisteredRiders';
import { initRegChampForm, validateRequiredFields } from './utils';
import { TextValidationService } from '@/libs/utils/text';
import BlockProfileRegRace from '@/components/BlockProfileRegRace/BlockProfileRegRace';
import styles from '../Form.module.css';

// types
import {
  TFormRaceRegistrationProps,
  TFormRaceRegistration,
  TProfileKey,
} from '@/types/index.interface';

const textValidation = new TextValidationService();

export default function FormRaceRegistration({
  championshipId,
  races,
  profile,
  categoriesConfigs,
}: TFormRaceRegistrationProps) {
  const toggleTrigger = useRegistrationRace((state) => state.toggleTrigger);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const selectOptions = useRegistrationRace((state) => state.selectOptions);
  const startNumberFree = useRegistrationRace((state) => state.startNumberFree);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TFormRaceRegistration>({
    mode: 'all',
    defaultValues: initRegChampForm(races),
  });

  // Отслеживание изменения свойства raceId в форме.
  const raceId = watch('raceId');

  // Обновление массива свободных стартовых номеров.
  useEffect(() => {
    if (!startNumberFree) {
      toast.error('Закончились свободные стартовые номера!');
      return;
    }

    setValue('startNumber', startNumberFree);
  }, [startNumberFree, setValue]);

  // Установка данных зарегистрированных райдеров в сторе, и генерация свободны стартовых номеров;
  useRegisteredRiders(raceId);

  const onSubmit: SubmitHandler<TFormRaceRegistration> = async (dataForm) => {
    try {
      const profileEntries = Object.entries(profile) as [TProfileKey, string | undefined][];

      for (const [key, value] of profileEntries) {
        const res = validateRequiredFields(value, key);

        if (!res.ok) {
          throw new Error(res.message);
        }
      }
      setLoading(true);
      toggleTrigger();
      const response = await registerForChampionship({
        championshipId,
        raceId: dataForm.raceId,
        startNumber: +dataForm.startNumber,
        teamVariable: dataForm.teamVariable,
        categoryName: dataForm.categoryName,
      });

      // Завершение отображение статуса загрузки.
      setLoading(false);

      // Отображение статуса сохранения События в БД.
      if (!response.ok) {
        throw new Error(response.message);
      }

      reset({ teamVariable: '' });
      toast.success(response.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Формирования options для выбора категории райдера.
  const categoryOptions = useMemo(() => {
    const categoriesIdInRace = races.find((r) => r._id === raceId)?.categories;
    const categories = categoriesConfigs.find((c) => c._id === categoriesIdInRace);

    if (!categoriesIdInRace || !categories) {
      return [{ id: 0, translation: 'Возрастная', name: 'Возрастная' }];
    }

    return createCategoryOptions(categories, profile.gender);
  }, [races, categoriesConfigs, raceId, profile.gender]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form__registration}>
      <div className={styles.wrapper__inputs}>
        <BoxSelectNew
          label="Выбор заезда:*"
          id="raceId"
          options={createOptionsRaces(races)}
          loading={isLoading}
          register={register('raceId', {
            required: 'Это обязательное поле для заполнения',
          })}
          validationText={errors.raceId?.message || ''}
        />
        <BoxSelectNew
          label="Выбор стартового номера:*"
          id="startNumber"
          options={selectOptions}
          loading={isLoading}
          register={register('startNumber', {
            required: 'Это обязательное поле для заполнения',
          })}
          validationText={errors.startNumber?.message || ''}
        />
        <BoxInput
          label="Название команды:"
          id="teamVariable"
          autoComplete="off"
          type="text"
          loading={isLoading}
          register={register('teamVariable', {
            minLength: { value: 2, message: 'Не меньше 2х символов' },
            maxLength: {
              value: 30,
              message: 'Не больше 30 символов',
            },
            validate: textValidation.spaces,
          })}
          validationText={errors.teamVariable?.message || ''}
        />

        <BoxSelectNew
          label="Выбор категории:*"
          id="categoryName"
          options={categoryOptions}
          loading={isLoading}
          register={register('categoryName', {
            required: 'Это обязательное поле для заполнения',
          })}
          validationText={errors.categoryName?.message || ''}
        />
      </div>

      {/* Блок отображения данных профиля для регистрации */}
      <BlockProfileRegRace profile={profile} />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button_registration}>
        <Button name={'Зарегистрироваться'} theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
