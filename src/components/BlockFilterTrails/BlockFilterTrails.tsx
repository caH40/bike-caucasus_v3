import { Dispatch, SetStateAction, useState } from 'react';

import {
  bikeTypes as optionsBikeType,
  regions as optionsRegions,
  difficultyLevel as optionsDifficultyLevel,
} from '@/constants/trail';
import IconAdjustmentsHorizontal from '../Icons/IconAdjustmentsHorizontal';
import SelectCustom from '../UI/SelectCustom/SelectCustom';
import styles from './BlockFilterTrails.module.css';

type Props = {
  bikeType: string;
  setBikeType: Dispatch<SetStateAction<string>>;
  region: string;
  setRegion: Dispatch<SetStateAction<string>>;
  difficultyLevel: string;
  setDifficultyLevel: Dispatch<SetStateAction<string>>;
  hasFilters?: boolean;
};

export default function BlockFilterTrails({
  bikeType,
  setBikeType,
  region,
  setRegion,
  difficultyLevel,
  setDifficultyLevel,
  hasFilters,
}: Props) {
  const [isVisibleFilters, setIsVisibleFilters] = useState<boolean>(false);
  return (
    <div className={styles.wrapper}>
      {isVisibleFilters && (
        <div className={styles.block__filters}>
          <div className={styles.type}>
            <SelectCustom state={bikeType} setState={setBikeType} options={optionsBikeType} />
          </div>

          <div className={styles.type}>
            <SelectCustom state={region} setState={setRegion} options={optionsRegions} />
          </div>

          <div className={styles.type}>
            <SelectCustom
              state={difficultyLevel}
              setState={setDifficultyLevel}
              options={optionsDifficultyLevel}
            />
          </div>
        </div>
      )}

      {/* Кнопка отображения фильтров */}
      <button
        className={styles.box__adjustments}
        onClick={() => setIsVisibleFilters((prev) => !prev)}
      >
        <IconAdjustmentsHorizontal colors={{ active: '#ec9c07' }} isActive={hasFilters} />
        <span className={styles.adjustments__text}>Фильтры</span>
      </button>
    </div>
  );
}
