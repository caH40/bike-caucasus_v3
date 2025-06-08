import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';

import { createRacePointsTableOptions } from '../Forms/FormChampionship/utils';
import { isChampionshipWithStages } from '@/libs/utils/championship/championship';
import BoxInput from '../BoxInput/BoxInput';
import BoxSelectNew from '../BoxSelect/BoxSelectNew';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import CheckboxRounded from '../CheckboxRounded/CheckboxRounded';
import t from '@/locales/ru/moderation/championship.json';
import styles from './BlockGC.module.css';

// types
import { TFormChampionshipCreate } from '@/types/index.interface';
import { TDtoChampionship, TRacePointsTableDto } from '@/types/dto.types';

import { TChampionshipTypes } from '@/types/models.interface';

type Props = {
  championshipForEdit?: TDtoChampionship;
  isLoading?: boolean;
  racePointsTables: TRacePointsTableDto[];
  register: UseFormRegister<TFormChampionshipCreate>;
  errors: FieldErrors<TFormChampionshipCreate>;
  control: Control<TFormChampionshipCreate, any>;
  championshipType: TChampionshipTypes;
};

/**
 * Блок с полями для ввода данных чемпионата типа Серия заездов и Тур.
 */
export default function BlockGC({
  isLoading,
  championshipForEdit,
  racePointsTables,
  register,
  championshipType,
  control,
  errors,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <TitleAndLine title="Параметры Серии заездов и Тура" hSize={2} />

      <div className={styles.inputs}>
        {/* Блок установки количества Этапов в Серии или Туре*/}
        <BoxInput
          label={t.labels.quantityStages}
          id="quantityStages"
          autoComplete="off"
          type="number"
          min="1"
          step="1"
          defaultValue={
            championshipForEdit?.quantityStages
              ? String(championshipForEdit.quantityStages)
              : '2'
          }
          loading={isLoading}
          register={register('quantityStages', {
            required: t.required,
            min: { value: 2, message: t.min.quantityStages },
            max: {
              value: 30,
              message: t.max.quantityStages,
            },
          })}
          validationText={errors.quantityStages ? errors.quantityStages.message : ''}
        />

        {/* Отображение выбора очковой таблицы только в Серии или Туре. */}
        {isChampionshipWithStages(championshipType) && (
          <BoxSelectNew
            label={t.labels.racePointsTable}
            id="racePointsTable"
            options={createRacePointsTableOptions(racePointsTables)}
            loading={isLoading}
            register={register('racePointsTable')}
            validationText={errors.racePointsTable?.message || ''}
          />
        )}

        <Controller
          name="awardedProtocols.category"
          control={control}
          render={({ field }) => {
            return (
              <CheckboxRounded
                id="awardedProtocolsCategory"
                label={t.labels.awardedProtocolsCategory}
                value={field.value ?? false}
                setValue={field.onChange}
                functional={false}
              />
            );
          }}
        />

        <Controller
          name="awardedProtocols.absolute"
          control={control}
          render={({ field }) => {
            return (
              <CheckboxRounded
                id="awardedProtocolsAbsolute"
                label={t.labels.awardedProtocolsAbsolute}
                value={field.value ?? false}
                setValue={field.onChange}
                functional={false}
              />
            );
          }}
        />

        <Controller
          name="awardedProtocols.absoluteGender"
          control={control}
          render={({ field }) => {
            return (
              <CheckboxRounded
                id="awardedProtocolsAbsoluteGender"
                label={t.labels.awardedProtocolsAbsoluteGender}
                value={field.value ?? false}
                setValue={field.onChange}
                functional={false}
              />
            );
          }}
        />
      </div>
    </div>
  );
}
