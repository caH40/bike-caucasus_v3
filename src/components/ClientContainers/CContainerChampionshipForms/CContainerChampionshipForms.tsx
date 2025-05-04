'use client';

import { useState } from 'react';

import styles from './CContainerChampionshipForms.module.css';
import { championshipFormNavigationButtons } from '@/constants/buttons';
import ChampionshipFormNavigation from '@/components/UI/Filters/ChampionshipFormNavigation/ChampionshipFormNavigation';
import FormChampionship from '@/components/UI/Forms/FormChampionship/FormChampionship';
import { TFormChampionshipProps } from '@/types/index.interface';

/**
 *  Клиентский контейнер для скачивания документов с зарегистрированными участниками Чемпионата.
 */
export default function CContainerChampionshipForms({
  organizer,
  fetchChampionshipCreated,
  parentChampionships,
}: TFormChampionshipProps) {
  const [activeIdBtn, setActiveIdBtn] = useState<number>(0);

  const formComponents: Record<number, JSX.Element> = {
    0: (
      <FormChampionship
        organizer={organizer}
        fetchChampionshipCreated={fetchChampionshipCreated}
        parentChampionships={parentChampionships}
      />
    ),
    1: <div>Категории</div>,
    2: <div>Races</div>,
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.spacer}>
        <ChampionshipFormNavigation
          buttons={championshipFormNavigationButtons}
          activeIdBtn={activeIdBtn}
          setActiveIdBtn={setActiveIdBtn}
        />
      </div>

      {formComponents[activeIdBtn]}
    </div>
  );
}
