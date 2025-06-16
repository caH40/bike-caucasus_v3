'use client';

import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useMemo } from 'react';

import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import Button from '../../Button/Button';
import BoxInput from '../../BoxInput/BoxInput';
import {
  createCategoryOptions,
  createStartNumbersOptions,
} from '@/app/championships/registration/[urlSlug]/utils';
import { useLoadingStore } from '@/store/loading';
import { useRegisteredRiders } from '@/hooks/useRegisteredRiders';
import { initRegChampForm } from './utils';
import { TextValidationService } from '@/libs/utils/text';
import { useCategoryName } from '@/hooks/useCategoryName';
import { useSubmitRegistration } from '@/hooks/forms/useSubmitRegistration';
import BlockProfileRegRace from '@/components/BlockProfileRegRace/BlockProfileRegRace';
import RaceSelectButtons from '@/UI/RaceSelectButtons/RaceSelectButtons';
import styles from '../Form.module.css';

// types
import { TFormRaceRegistrationProps, TFormRaceRegistration } from '@/types/index.interface';

const textValidation = new TextValidationService();

export default function FormRaceRegistration({
  championshipId,
  races,
  profile,
  categoriesConfigs,
  startNumbersLists,
}: TFormRaceRegistrationProps) {
  const isLoading = useLoadingStore((state) => state.isLoading);

  const selectOptions = createStartNumbersOptions(startNumbersLists.free);
  // const selectOptions = useRegistrationRace((state) => state.selectOptions);
  const startNumberFree = startNumbersLists.free[0];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<TFormRaceRegistration>({
    mode: 'all',
    defaultValues: initRegChampForm(races),
  });

  // Отслеживание изменения свойства raceId в форме.
  const raceId = watch('raceId');
  const categoryName = watch('categoryName');

  // Названия возрастной или спецкатегории для регистрирующегося участника.
  const { category } = useCategoryName({
    races,
    categoriesConfigs,
    profile,
    raceId,
    categoryName,
  });

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

  const onSubmit = useSubmitRegistration({ championshipId, profile, reset });

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
        <Controller
          name="raceId"
          control={control}
          rules={{ required: 'Это обязательное поле для заполнения' }}
          render={({ field, fieldState }) => (
            <RaceSelectButtons
              races={races.map((r) => ({
                name: r.name,
                id: r._id,
                description: r.description,
              }))}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
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
      <BlockProfileRegRace profile={profile} category={category} />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button_registration}>
        <Button name={'Зарегистрироваться'} theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
