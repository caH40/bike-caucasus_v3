import { MouseEvent } from 'react';
import Image from 'next/image';
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form';

import BoxInput from '../BoxInput/BoxInput';
import BoxTextarea from '../BoxTextarea/BoxTextarea';
import BlockUploadTrack from '../BlockUploadTrack/BlockUploadTrack';
import { raceInit } from '@/constants/championship';
import type { TFormChampionshipCreate, TRaceForForm } from '@/types/index.interface';
import type { TRace } from '@/types/models.interface';
import styles from './BlockRaceAdd.module.css';

type Props = {
  race: TRace;
  races: FieldArrayWithId<TFormChampionshipCreate, 'races', 'id'>[];
  index: number;
  register: UseFormRegister<TFormChampionshipCreate>;
  append: UseFieldArrayAppend<TFormChampionshipCreate, 'races'>;
  remove: UseFieldArrayRemove;
  errors: FieldErrors<TFormChampionshipCreate>;
  control: Control<TFormChampionshipCreate, any>;
  isLoading: boolean;
};

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
}: Props) {
  // Добавление Заезда.
  const addRace = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const raceLast = races.at(-1)?.number;
    // Определение нового номера заезда на основе длины массива races
    const newNumber = raceLast ? raceLast + 1 : 1;

    const newRace: TRaceForForm = {
      ...raceInit,
      number: newNumber, // Установка номера нового заезда
    };

    append(newRace);
  };

  // Удаление Заезда.
  const deleteRace = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    remove(index);
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{`Блок данных Заезда (дистанции) №${race.number}`}</h3>

      <div className={styles.wrapper__inputs}>
        <div className={styles.block__icons_right}>
          <button onClick={(e) => addRace(e)} className={styles.btn}>
            <Image
              width={26}
              height={22}
              src="/images/icons/add-square.svg"
              alt="Insert a link"
              className={styles.icon__img}
            />
          </button>

          {race.number !== 1 && (
            <button onClick={(e) => deleteRace(e)} className={styles.btn}>
              <Image
                width={26}
                height={22}
                src="/images/icons/delete-square.svg"
                alt="Insert a link"
                className={styles.icon__img}
              />
            </button>
          )}
        </div>

        {/* Блок ввода Названия */}
        <BoxInput
          label="Название должно быть уникальным:*"
          id={`races.${index}.name`}
          autoComplete="off"
          type="text"
          defaultValue={''}
          loading={isLoading}
          register={register(`races.${index}.name`, {
            required: 'Это обязательное поле для заполнения',
            minLength: { value: 3, message: 'Название должно быть больше 2х символов' },
            maxLength: {
              value: 50,
              message: 'Название не может быть больше 50 символов',
            },
            // validate: textValidation.spaces,
          })}
          validationText={errors?.races?.[index]?.name?.message || ''}
        />

        {/* Блок ввода Описания */}
        <BoxTextarea
          label="Описание:*"
          id={`races.${index}.description`}
          autoComplete="off"
          type="text"
          defaultValue={''}
          loading={isLoading}
          register={register(`races.${index}.description`, {
            required: 'Это обязательное поле для заполнения',
            minLength: { value: 25, message: 'В описании должно быть больше 25х символов' },
            maxLength: {
              value: 4000,
              message: 'В описании не может быть больше 4000 символов',
            },
            // validate: textValidation.spaces,
          })}
          validationText={errors?.races?.[index]?.description?.message || ''}
        />

        {/* Блок заполнения количества кругов */}
        <BoxInput
          label="Количество кругов:*"
          id={`races.${index}.laps`}
          autoComplete="off"
          type="number"
          defaultValue={''}
          loading={isLoading}
          register={register(`races.${index}.laps`, {
            required: 'Это обязательное поле для заполнения',
            min: { value: 1, message: 'Минимальное количество 1 круг' },
            max: {
              value: 100,
              message: 'Не более 100 кругов',
            },
          })}
          validationText={errors?.races?.[index]?.laps?.message || ''}
        />

        {/* Блок заполнения длины дистанции в километрах */}
        <BoxInput
          label="Общая длина дистанции в километрах:*"
          id={`races.${index}.distance`}
          autoComplete="off"
          type="number"
          defaultValue={''}
          loading={isLoading}
          register={register(`races.${index}.distance`, {
            required: 'Это обязательное поле для заполнения',
            min: { value: 2, message: 'Минимальное количество 1км' },
            max: {
              value: 20000,
              message: 'Не более 20000 км',
            },
          })}
          validationText={errors?.races?.[index]?.distance?.message || ''}
        />

        {/* Блок заполнения общего набора высоты */}
        <BoxInput
          label="Общий набор высоты на дистанции в метрах:"
          id={`races.${index}.ascent`}
          autoComplete="off"
          type="number"
          defaultValue={''}
          loading={isLoading}
          register={register(`races.${index}.ascent`, {
            // required: 'Это обязательное поле для заполнения',
            max: {
              value: 20000,
              message: 'Не более 20000 метров',
            },
          })}
          validationText={errors?.races?.[index]?.ascent?.message || ''}
        />

        {/* Блок загрузки GPX трека*/}
        <Controller
          name={`races.${index}.trackGPXFile`}
          control={control}
          defaultValue={null}
          rules={{ required: 'Файл трека обязателен' }}
          render={({ field }) => (
            <BlockUploadTrack
              title={'Трек заезда:'}
              setTrack={field.onChange}
              isLoading={isLoading}
              resetData={false}
              isRequired={false}
              value={'нет'}
              validationText={errors?.races?.[index]?.trackGPX?.message || ''}
              // needDelTrack={needDelTrack}
              // setNeedDelTrack={setNeedDelTrack}
            />
          )}
        />
      </div>
    </div>
  );
}
