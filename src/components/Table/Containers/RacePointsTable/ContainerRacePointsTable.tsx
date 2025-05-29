'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { lcRecordsOnPage } from '@/constants/local-storage';
import FilterBoxForTable from '../../../UI/FilterBoxForTable/FilterBoxForTable';
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
  // Строка поиска разрешения.
  const [search, setSearch] = useState('');
  const [docsOnPage, setDocsOnPage] = useState(5);
  const [racePointsTable, setRacePointsTable] = useState<RacePointsTableState | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const isMounting = useRef(true);

  useEffect(() => {
    const initialDocsOnPage = parseInt(localStorage.getItem(lcRecordsOnPage) || '5', 10);
    setDocsOnPage(initialDocsOnPage);
  }, []);

  useEffect(() => {
    // Если происходит монтирование компонента, то не записывать данные в Локальное хранилище.
    if (isMounting.current) {
      isMounting.current = false;
      return;
    }

    localStorage.setItem(lcRecordsOnPage, String(docsOnPage));
  }, [docsOnPage]);

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
      <div className={styles.block__filter}>
        <FilterBoxForTable
          docsOnPage={docsOnPage}
          setDocsOnPage={setDocsOnPage}
          search={search}
          setSearch={setSearch}
          placeholder={'поиск'}
        />
      </div>

      {/* Таблица */}
      <Spacer margin="b-md">
        <TableModerateRacePointsTable
          racePointsTables={racePointsTables}
          docsOnPage={docsOnPage}
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

      {racePointsTable && racePointsTable.action === 'create' && (
        <div className={styles.form}>
          <FormRacePointsTable
            organizerId={organizerId}
            setIsFormDirty={setIsFormDirty}
            action={'create'}
            setRacePointsTable={setRacePointsTable}
          />
        </div>
      )}
    </>
  );
}
