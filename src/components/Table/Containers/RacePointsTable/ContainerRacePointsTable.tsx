'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import TableModerateRacePointsTable from '../../TableModerateRacePointsTable/TableModerateRacePointsTable';
import FormRacePointsTable from '@/components/UI/Forms/FormRacePointsTable/FormRacePointsTable';
import AddRemoveSquareButtonGroup from '@/components/AddRemoveSquareButtonGroup/AddRemoveSquareButtonGroup';
import AddRemoveSquareButton from '@/components/UI/Buttons/AddRemoveSquareButton';
import TableRacePointsTable from '../../TableRacePointsTable/TableRacePointsTable';
import Spacer from '@/components/Spacer/Spacer';
import styles from './ContainerRacePointsTable.module.css';

// types
import { TRacePointsTableDto } from '@/types/dto.types';
import { RacePointsTableState, TRacePointsTableAction } from '@/types/index.interface';

type Props = {
  racePointsTables: TRacePointsTableDto[];
  organizerId: string;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerRacePointsTable({ racePointsTables, organizerId }: Props) {
  const [racePointsTable, setRacePointsTable] = useState<RacePointsTableState | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Очистка контейнера при изменении входных данных (в частности после удаления таблицы).
  useEffect(() => {
    setRacePointsTable(null);
  }, [racePointsTables]);

  // Редактирование выбранной очковой таблицы.
  const handleClick = (_id: string | null, action: TRacePointsTableAction) => {
    if (_id === null && action === 'create') {
      setRacePointsTable({ action });
      return;
    }

    if (!_id || _id === 'undefined') {
      toast.error(`Не получен _id ${_id}!`);
      return;
    }

    const data = racePointsTables.find((r) => r._id === _id);

    if (!data) {
      toast.error(`Не получены данные очковой таблицы с _id ${_id}!`);
      return;
    }

    setRacePointsTable({ data, action });
  };

  return (
    <>
      {/* Таблица */}
      <Spacer margin="b-md">
        <TableModerateRacePointsTable
          racePointsTables={racePointsTables}
          docsOnPage={50}
          handleClick={handleClick}
        />
      </Spacer>

      <Spacer margin="b-lg">
        <AddRemoveSquareButtonGroup label={'Добавить таблицу'}>
          <AddRemoveSquareButton
            action={'add'}
            actionFunction={() => handleClick(null, 'create')}
          />
        </AddRemoveSquareButtonGroup>
      </Spacer>

      {racePointsTable?.data && racePointsTable.action === 'view' && (
        <div className={styles.points}>
          <TableRacePointsTable racePointsTable={racePointsTable.data} />
        </div>
      )}

      {racePointsTable &&
        (racePointsTable.action === 'edit' || racePointsTable.action === 'create') && (
          <div className={styles.form}>
            <FormRacePointsTable
              racePointsTable={racePointsTable.data}
              organizerId={organizerId}
              setIsFormDirty={setIsFormDirty}
              action={racePointsTable.action}
              setRacePointsTable={setRacePointsTable}
            />
          </div>
        )}
    </>
  );
}
