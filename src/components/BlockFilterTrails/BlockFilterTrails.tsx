import { Dispatch, SetStateAction } from 'react';
import styles from './BlockFilterTrails.module.css';
import { bikeTypes as optionsBikeType } from '@/constants/trail';
import Select from '../UI/Select/Select';
import IconAdjustmentsHorizontal from '../Icons/IconAdjustmentsHorizontal';

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
          <Select
            state={bikeType}
            setState={setBikeType}
            name="bikeType"
            options={optionsBikeType}
          />
        </div>
      </div>
      <button className={styles.box__adjustments}>
        <span className={styles.adjustments__text}>Фильтры</span>
        <IconAdjustmentsHorizontal colors={{ active: '#ec9c07' }} isActive={hasFilters} />
      </button>
    </div>
  );
}
