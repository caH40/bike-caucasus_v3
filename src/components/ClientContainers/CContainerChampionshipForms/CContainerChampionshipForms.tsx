'use client';

import { useState } from 'react';

import styles from './CContainerChampionshipForms.module.css';
import { championshipFormNavigationButtons } from '@/constants/buttons';
import ChampionshipFormNavigation from '@/components/UI/Filters/ChampionshipFormNavigation/ChampionshipFormNavigation';
import FormChampionship from '@/components/UI/Forms/FormChampionship/FormChampionshipMain';
import { TCContainerChampionshipFormsProps } from '@/types/index.interface';
import FormChampionshipCategories from '@/components/UI/Forms/FormChampionship/FormChampionshipCategories';
import FormChampionshipRaces from '@/components/UI/Forms/FormChampionship/FormChampionshipRaces';
import { getHiddenButtonNamesForEditChamp } from '@/libs/utils/championship/championship';

/**
 *  Клиентский контейнер для скачивания документов с зарегистрированными участниками Чемпионата.
 */
export default function CContainerChampionshipForms({
  organizer,
  fetchChampionshipCreated,
  parentChampionships,
  championshipForEdit,
  putChampionship,
  putCategories,
  putRaces,
  racePointsTables,
  distances,
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
      if (!confirmed) {
        return;
      }
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
        championshipForEdit={championshipForEdit}
        putChampionship={putChampionship}
        racePointsTables={racePointsTables}
      />
    ),
    1: (championshipForEdit && putCategories && (
      <FormChampionshipCategories
        organizerId={organizer._id}
        putCategories={putCategories}
        categoriesConfigs={championshipForEdit.categoriesConfigs}
        urlSlug={championshipForEdit.urlSlug}
        setIsFormDirty={setIsFormDirty}
      />
    )) || <div>Не получены данные championshipForEdit или putCategories</div>,
    2: (championshipForEdit &&
      putRaces &&
      !['series', 'tour'].includes(championshipForEdit.type) && (
        <FormChampionshipRaces
          organizerId={organizer._id}
          putRaces={putRaces}
          categoriesConfigs={championshipForEdit.categoriesConfigs}
          races={championshipForEdit.races}
          urlSlug={championshipForEdit.urlSlug}
          setIsFormDirty={setIsFormDirty}
          distances={distances}
        />
      )) || <div>Не получены данные championshipForEdit</div>,
  };

  return (
    <div className={styles.wrapper}>
      {championshipForEdit && (
        <div className={styles.spacer}>
          <ChampionshipFormNavigation
            buttons={championshipFormNavigationButtons}
            activeIdBtn={activeIdBtn}
            setActiveIdBtn={handleChangeTab}
            hiddenButtonNames={getHiddenButtonNamesForEditChamp(championshipForEdit.type)}
          />
        </div>
      )}

      {formComponents[activeIdBtn]}
    </div>
  );
}
