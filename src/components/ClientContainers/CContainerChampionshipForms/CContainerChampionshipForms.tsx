'use client';

import { useState } from 'react';

import styles from './CContainerChampionshipForms.module.css';
import { championshipFormNavigationButtons } from '@/constants/buttons';
import ChampionshipFormNavigation from '@/components/UI/Filters/ChampionshipFormNavigation/ChampionshipFormNavigation';
import FormChampionship from '@/components/UI/Forms/FormChampionship/FormChampionship';
import { TCContainerChampionshipFormsProps } from '@/types/index.interface';

/**
 *  Клиентский контейнер для скачивания документов с зарегистрированными участниками Чемпионата.
 */
export default function CContainerChampionshipForms({
  organizer,
  fetchChampionshipCreated,
  parentChampionships,
  championshipForEdit,
}: TCContainerChampionshipFormsProps) {
  const [activeIdBtn, setActiveIdBtn] = useState<number>(0);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleChangeTab = (id: number) => {
    if (id === activeIdBtn) {
      return;
    }

    if (isFormDirty) {
      const confirmed = window.confirm(
        'Уверены, что хотите переключиться? Введённые вами данные будут потеряны. Сохранитесь перед переходом на другую страницу!'
      );
      if (!confirmed) return;
    }

    // При изменении активной формы сбрасывать isFormDirty в false.
    setIsFormDirty(false);

    setActiveIdBtn(id);
  };

  const formComponents: Record<number, JSX.Element> = {
    0: (
      <FormChampionship
        organizer={organizer}
        fetchChampionshipCreated={fetchChampionshipCreated}
        parentChampionships={parentChampionships}
        setIsFormDirty={setIsFormDirty}
      />
    ),
    1: <div>Категории</div>,
    2: <div>Races</div>,
  };

  return (
    <div className={styles.wrapper}>
      {championshipForEdit && (
        <div className={styles.spacer}>
          <ChampionshipFormNavigation
            buttons={championshipFormNavigationButtons}
            activeIdBtn={activeIdBtn}
            setActiveIdBtn={handleChangeTab}
          />
        </div>
      )}

      {formComponents[activeIdBtn]}
    </div>
  );
}
