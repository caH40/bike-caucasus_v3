import { raceInit } from '@/constants/championship';
import { TextValidationService } from '@/libs/utils/text';
import { useTrackDistance } from '@/hooks/useTrackDistance';
import BoxInput from '../BoxInput/BoxInput';
import BoxTextarea from '../BoxTextarea/BoxTextarea';

import IconInfo from '@/components/Icons/IconInfo';
import t from '@/locales/ru/moderation/championship.json';
import BoxSelectNew from '../BoxSelect/BoxSelectNew';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import AddRemoveSquareButtonGroup from '@/components/AddRemoveSquareButtonGroup/AddRemoveSquareButtonGroup';
import AddRemoveSquareButton from '../Buttons/AddRemoveSquareButton';
import styles from './BlockRaceAdd.module.css';

// types
import type { TBlockRaceAddProps, TRaceForFormNew } from '@/types/index.interface';

const textValidation = new TextValidationService();

export default function BlockRaceAdd({
  race,
  index,
  races,
  register,
  append,
  remove,
  errors,
  control,
  isLoading,
  categories,
  distanceOptions,
  distances,
  setValue,
}: TBlockRaceAddProps) {
  // Контроль за изменением trackDistance и обновлении полей, если изменен trackDistance.
  useTrackDistance({ setValue, control, distances, index });

  // Добавление Заезда.
  const addRace = (): void => {
    const raceLast = races.at(-1)?.number;
    // Определение нового номера заезда на основе длины массива races
    const newNumber = raceLast ? raceLast + 1 : 1;

    const newRace: TRaceForFormNew = {
      ...raceInit,
      number: newNumber, // Установка номера нового заезда
    };

    append(newRace);
  };

  // Удаление Заезда.
  const deleteRace = (): void => {
    remove(index);
  };

  const tooltip = { text: t.tooltips.raceBlock, id: 'raceBlock' };

  const errorsBasePath = errors?.races?.[index];

  return (
    <div className={styles.wrapper}>
      <TitleAndLine title={'Редактирование заезда'} hSize={2} />

      <h3 className={styles.title}>
        <div className={styles.box__info}>
          {`${t.titleBlockRaceAdd} №${race.number}`}
          {<IconInfo squareSize={20} tooltip={tooltip} />}
        </div>
      </h3>

      <div className={styles.block__icons}>
        {/* Кнопка для добавления новой категории */}
        <div className={styles.control}>
          <AddRemoveSquareButtonGroup label={'Добавить заезд'}>
            <AddRemoveSquareButton action={'add'} actionFunction={addRace} />
          </AddRemoveSquareButtonGroup>

          {race.number !== 1 && races.length > 1 && (
            <AddRemoveSquareButtonGroup label={'Удалить данный заезд'}>
              <AddRemoveSquareButton action={'delete'} actionFunction={deleteRace} />
            </AddRemoveSquareButtonGroup>
          )}
        </div>
      </div>

      <div className={styles.wrapper__inputs}>
        <BoxSelectNew
          label={'Выбор дистанции'}
          id="type-BoxSelectNew"
          options={distanceOptions}
          loading={isLoading}
          register={register(`races.${index}.trackDistance`, { required: t.required })}
          validationText={errorsBasePath?.trackDistance?.message || ''}
        />

        {/* Блок ввода Названия */}
        <BoxInput
          label={t.labels.nameChampionship}
          id={`races.${index}.name`}
          autoComplete="off"
          type="text"
          loading={isLoading}
          register={register(`races.${index}.name`, {
            required: t.required,
            minLength: { value: 3, message: t.min.nameRace },
            maxLength: {
              value: 50,
              message: t.max.nameRace,
            },
            validate: textValidation.spaces,
          })}
          validationText={errorsBasePath?.name?.message || ''}
          tooltip={{ text: t.tooltips.nameRace, id: 'nameRace' }}
        />

        {/* Блок ввода Описания */}
        <BoxTextarea
          label={t.labels.descriptionRace}
          id={`races.${index}.description`}
          autoComplete="off"
          type="text"
          defaultValue={''}
          loading={isLoading}
          register={register(`races.${index}.description`, {
            required: t.required,
            minLength: { value: 20, message: t.min.descriptionRace },
            maxLength: {
              value: 100,
              message: t.max.descriptionRace,
            },
          })}
          validationText={errorsBasePath?.description?.message || ''}
          tooltip={{ text: t.tooltips.descriptionRace, id: 'descriptionRace' }}
        />

        <BoxSelectNew
          label={t.labels.categoriesConfig}
          id="type-BoxSelectNew"
          options={categories}
          defaultValue={categories.find((c) => c.translation === 'Стандартный')?.name}
          loading={isLoading}
          register={register(`races.${index}.categories`, { required: t.required })}
          validationText={errorsBasePath?.categories?.message || ''}
          tooltip={{ text: t.tooltips.categoriesConfig, id: 'categories' }}
        />

        {/* Блок заполнения количества кругов */}
        <BoxInput
          label={t.labels.laps}
          id={`races.${index}.laps`}
          autoComplete="off"
          type="number"
          step="1"
          min="1"
          defaultValue={''}
          loading={isLoading}
          register={register(`races.${index}.laps`, {
            required: t.required,
            min: { value: 1, message: t.min.laps },
            max: {
              value: 100,
              message: t.max.laps,
            },
          })}
          validationText={errorsBasePath?.laps?.message || ''}
        />

        {/* Блок заполнения длины дистанции в километрах */}
        <BoxInput
          label={t.labels.distance}
          id={`races.${index}.distance`}
          autoComplete="off"
          step={0.001}
          type="number"
          disabled={true}
          loading={isLoading}
          register={register(`races.${index}.distance`, {
            required: t.required,
            min: { value: 0.1, message: t.min.distance },
            max: {
              value: 20000,
              message: t.max.distance,
            },
          })}
          validationText={errorsBasePath?.distance?.message || ''}
        />

        {/* Блок заполнения общего набора высоты */}
        <BoxInput
          label={t.labels.ascent}
          id={`races.${index}.ascent`}
          autoComplete="off"
          type="number"
          defaultValue={''}
          loading={isLoading}
          register={register(`races.${index}.ascent`, {
            // required: 'Это обязательное поле для заполнения',
            max: {
              value: 20000,
              message: t.max.ascent,
            },
          })}
          validationText={errorsBasePath?.ascent?.message || ''}
        />
      </div>
    </div>
  );
}
