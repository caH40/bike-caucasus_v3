import { Dispatch, SetStateAction, useRef, useState } from 'react';
import cn from 'classnames/bind';

import {
  bikeTypes as optionsBikeType,
  regions as optionsRegions,
  difficultyLevel as optionsDifficultyLevel,
  sortCategories as optionsSortCategories,
} from '@/constants/trail';
import IconAdjustmentsHorizontal from '../Icons/IconAdjustmentsHorizontal';
import SelectCustom from '../UI/SelectCustom/SelectCustom';
import styles from './BlockFilterTrails.module.css';
import IconArrowTrendingUp from '../Icons/IconArrowTrendingUp';
import IconArrowTrendingDown from '../Icons/IconArrowTrendingDown';
import { Transition } from 'react-transition-group';

type Props = {
  bikeType: string;
  setBikeType: Dispatch<SetStateAction<string>>;
  region: string;
  setRegion: Dispatch<SetStateAction<string>>;
  difficultyLevel: string;
  setDifficultyLevel: Dispatch<SetStateAction<string>>;
  sortDirection: string;
  setSortDirection: Dispatch<SetStateAction<string>>;
  sortTarget: string;
  setSortTarget: Dispatch<SetStateAction<string>>;
  hasFilters?: boolean;
  resetFilters: () => void;
  quantityTrails: number | undefined;
};

const cx = cn.bind(styles);

export default function BlockFilterTrails({
  bikeType,
  setBikeType,
  region,
  setRegion,
  difficultyLevel,
  setDifficultyLevel,
  hasFilters,
  resetFilters,
  quantityTrails,
  sortDirection,
  setSortDirection,
  sortTarget,
  setSortTarget,
}: Props) {
  const [isVisibleFilters, setIsVisibleFilters] = useState<boolean>(false);
  const nodeRef = useRef(null);

  return (
    <div className={styles.wrapper}>
      {/* Блок показывает количество найденных маршрутов и кнопку отображения фильтров */}
      <div className={styles.wrapper__control}>
        <div className={styles.box__quantity}>
          <span className={styles.adjustments__text}>{`Маршруты: ${
            quantityTrails ? quantityTrails : 0
          }`}</span>
        </div>

        {/* Кнопка отображения фильтров */}
        <button
          className={styles.box__adjustments}
          onClick={() => setIsVisibleFilters((prev) => !prev)}
        >
          <IconAdjustmentsHorizontal colors={{ active: '#ec9c07' }} isActive={hasFilters} />
          <span className={styles.adjustments__text}>Фильтры</span>
        </button>
      </div>

      {/* Блок фильтров */}
      <Transition
        in={isVisibleFilters}
        timeout={300}
        nodeRef={nodeRef}
        unmountOnExit={true}
        mountOnEnter={true}
      >
        {(state) => {
          return (
            <div
              className={cx('wrapper__filters', state)}
              onMouseLeave={() => setIsVisibleFilters(false)}
              ref={nodeRef}
            >
              <div className={styles.block__filters}>
                <div className={styles.type}>
                  <SelectCustom
                    state={bikeType}
                    setState={setBikeType}
                    options={optionsBikeType}
                    label="Тип велосипеда"
                  />
                </div>

                <div className={styles.type}>
                  <SelectCustom
                    state={region}
                    setState={setRegion}
                    options={optionsRegions}
                    label="Регион"
                  />
                </div>

                <div className={styles.type}>
                  <SelectCustom
                    state={difficultyLevel}
                    setState={setDifficultyLevel}
                    options={optionsDifficultyLevel}
                    label="Уровень сложности"
                  />
                </div>
              </div>

              <div className={styles.block__filters}>
                <div className={styles.type}>
                  <SelectCustom
                    defaultValue={'Дистанция'}
                    state={sortTarget}
                    setState={setSortTarget}
                    options={optionsSortCategories}
                    label="Сортировка"
                  />
                </div>

                <button
                  className={cx('box__adjustments', 'box__reset')}
                  onClick={() => setSortDirection(sortDirection === 'up' ? 'down' : 'up')}
                >
                  {sortDirection === 'up' ? <IconArrowTrendingUp /> : <IconArrowTrendingDown />}
                </button>
              </div>

              <div className={styles.block__reset}>
                <button
                  className={cx('box__adjustments', 'box__reset')}
                  onClick={() => resetFilters()}
                >
                  <span className={styles.adjustments__text}>Сброс</span>
                </button>
              </div>
            </div>
          );
        }}
      </Transition>
    </div>
  );
}
