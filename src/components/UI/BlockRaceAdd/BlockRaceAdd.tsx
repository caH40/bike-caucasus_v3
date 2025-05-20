import { MouseEvent } from 'react';
import Image from 'next/image';
import { Controller } from 'react-hook-form';

import { raceInit } from '@/constants/championship';
import { TextValidationService } from '@/libs/utils/text';
import BoxInput from '../BoxInput/BoxInput';
import BoxTextarea from '../BoxTextarea/BoxTextarea';
import BlockUploadTrack from '../BlockUploadTrack/BlockUploadTrack';
import IconInfo from '@/components/Icons/IconInfo';
import t from '@/locales/ru/moderation/championship.json';
import styles from './BlockRaceAdd.module.css';

// types
import type { TBlockRaceAddProps, TRaceForFormNew } from '@/types/index.interface';
import BoxSelectNew from '../BoxSelect/BoxSelectNew';

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
  urlTracksForDel,
  categories,
}: TBlockRaceAddProps) {
  // Добавление Заезда.
  const addRace = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
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
  const deleteRace = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    // index начинается с нуля, а number c 1.
    const trackGPXUrl = races.find((elm) => elm.number === index + 1)?.trackGPXUrl;
    if (trackGPXUrl) {
      urlTracksForDel.current.push(trackGPXUrl);
    }

    remove(index);
  };

  const tooltip = { text: t.tooltips.raceBlock, id: 'raceBlock' };

  const errorsBasePath = errors?.races?.[index];

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        <div className={styles.box__info}>
          {`${t.titleBlockRaceAdd} №${race.number}`}
          {<IconInfo squareSize={20} tooltip={tooltip} />}
        </div>
      </h3>

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

          {races.length > 1 && (
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
          label={t.labels.nameChampionship}
          id={`races.${index}.name`}
          autoComplete="off"
          type="text"
          defaultValue={''}
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
          type="number"
          defaultValue={''}
          loading={isLoading}
          register={register(`races.${index}.distance`, {
            required: t.required,
            min: { value: 2, message: t.min.distance },
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

        {/* Блок загрузки GPX трека*/}
        <Controller
          name={`races.${index}.trackGPXFile`}
          control={control}
          defaultValue={null}
          rules={races?.[index]?.trackGPXUrl ? {} : { required: t.trackGPXFile }}
          render={({ field }) => (
            <BlockUploadTrack
              title={t.labels.trackGPXFile}
              setTrack={field.onChange}
              isLoading={isLoading}
              resetData={false}
              isRequired={true}
              value={race.trackGPXUrl || t.not}
              validationText={errorsBasePath?.trackGPXFile?.message || ''}
              tooltip={{ text: t.tooltips.track, id: 'track' }}
            />
          )}
        />
      </div>
    </div>
  );
}
