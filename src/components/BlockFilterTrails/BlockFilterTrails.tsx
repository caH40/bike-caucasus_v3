import { Dispatch, SetStateAction } from 'react';
import styles from './BlockFilterTrails.module.css';
import { bikeTypes as optionsBikeType } from '@/constants/trail';
import Select from '../UI/Select/Select';

type Props = {
  bikeType: string;
  setBikeType: Dispatch<SetStateAction<string>>;
};

export default function BlockFilterTrails({ bikeType, setBikeType }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.type}>
        <Select
          state={bikeType}
          setState={setBikeType}
          name="bikeType"
          options={optionsBikeType}
        />
      </div>
    </div>
  );
}
