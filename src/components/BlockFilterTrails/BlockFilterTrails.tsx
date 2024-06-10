import { Dispatch, SetStateAction } from 'react';

import { bikeTypes as optionsBikeType } from '@/constants/trail';
import IconAdjustmentsHorizontal from '../Icons/IconAdjustmentsHorizontal';
import SelectCustom from '../UI/SelectCustom/SelectCustom';
import styles from './BlockFilterTrails.module.css';

type Props = {
  bikeType: string;
  setBikeType: Dispatch<SetStateAction<string>>;
  hasFilters?: boolean;
};

export default function BlockFilterTrails({ bikeType, setBikeType, hasFilters }: Props) {
  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.type}>
          <SelectCustom state={bikeType} setState={setBikeType} options={optionsBikeType} />
        </div>
      </div>
      <button className={styles.box__adjustments}>
        <IconAdjustmentsHorizontal colors={{ active: '#ec9c07' }} isActive={hasFilters} />
        <span className={styles.adjustments__text}>Фильтры</span>
      </button>
    </div>
  );
}
