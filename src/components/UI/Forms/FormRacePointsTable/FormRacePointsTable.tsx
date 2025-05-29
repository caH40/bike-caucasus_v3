'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';
import Button from '../../Button/Button';
import t from '@/locales/ru/moderation/championship.json';
import { useSubmitRacePointsTable } from './useSubmitChampionshipCategories';
import BoxInput from '../../BoxInput/BoxInput';
import styles from '../Form.module.css';

// types
import type { TFormCRacePointsTableProps, TRacePointsTableForm } from '@/types/index.interface';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import BlockRacePointsInput from '../../BlockRacePointsInput/BlockRacePointsInput';
import { toast } from 'sonner';
import AddRemoveSquareButtonGroup from '@/components/AddRemoveSquareButtonGroup/AddRemoveSquareButtonGroup';
import AddRemoveSquareButton from '../../Buttons/AddRemoveSquareButton';

/**
 * Форма создания/редактирования таблицы начисления очков за этапы серии заездов.
 */
export default function FormRacePointsTable({
  racePointsTable,
  putRacePointsTable,
  setIsFormDirty,
  organizerId,
}: TFormCRacePointsTableProps) {
  const isLoading = useLoadingStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<TRacePointsTableForm>({
    mode: 'all',
    defaultValues: {
      _id: racePointsTable?._id,
      name: racePointsTable?.name ?? '',
      organizer: organizerId,
      description: racePointsTable?.description ?? '',
      rules: racePointsTable?.rules ?? [{ place: 1, points: 100 }],
      fallbackPoints: racePointsTable?.fallbackPoints ?? 0,
      isDefault: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
  });

  const handleButtonForRacePointsBlock = (action: 'delete' | 'add') => {
    const rules = getValues('rules');

    if (action === 'add') {
      const nextPlace = rules.length + 1;
      append({ place: nextPlace, points: 0 });
    } else {
      if (rules.length === 0) {
        toast.error('Нет строк для удаления');
        return;
      }

      remove(rules.length - 1);
    }
  };

  // Функция отправки формы редактирования категорий Чемпионата.
  // const onSubmit = useSubmitRacePointsTable({
  //   organizerId,
  //   putRacePointsTable,
  //   racePointsTableId,
  //   setIsFormDirty,
  // });

  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      <div className={styles.wrapper__block}>
        <BoxInput
          label="Название:*"
          id={`name`}
          autoComplete="off"
          type="text"
          loading={isLoading}
          register={register('name', {
            required: 'Обязательно для заполнения',
            minLength: { value: 3, message: 'Минимум 3 символа!' },
            maxLength: {
              value: 50,
              message: t.max.nameRace,
            },
          })}
          validationText={errors?.name?.message || ''}
        />

        <BoxTextarea
          label="Описание:"
          id="description"
          autoComplete="off"
          type="text"
          loading={isLoading}
          register={register('description', {
            minLength: {
              value: 10,
              message: 'Не меньше 10 символов',
            },
            maxLength: {
              value: 200,
              message: 'Не больше 200 символов',
            },
          })}
          validationText={errors?.description?.message ?? ''}
        />

        <BoxInput
          label="Очки для всех мест, не указанных в таблице:"
          id={`fallbackPoints`}
          autoComplete="off"
          type="number"
          step={1}
          loading={isLoading}
          register={register('fallbackPoints')}
          validationText={errors?.fallbackPoints?.message || ''}
        />
      </div>

      <div className={styles.wrapper__block}>
        <div>
          <div className={styles.header__points}>
            <span>Место</span>
            <span>Очки</span>
          </div>
          {fields.map((field, index) => (
            <BlockRacePointsInput register={register} index={index} key={field.id} />
          ))}
        </div>

        {/* Кнопки добавления/удаления строк из таблицы */}
        <div className={styles.control}>
          <AddRemoveSquareButtonGroup label={'Добавить строку'}>
            <AddRemoveSquareButton
              action={'add'}
              actionFunction={() => handleButtonForRacePointsBlock('add')}
            />
          </AddRemoveSquareButtonGroup>

          <AddRemoveSquareButtonGroup label={'Удалить последнюю строку'}>
            <AddRemoveSquareButton
              action={'delete'}
              actionFunction={() => handleButtonForRacePointsBlock('delete')}
            />
          </AddRemoveSquareButtonGroup>
        </div>
      </div>

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={t.btn.save} theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
