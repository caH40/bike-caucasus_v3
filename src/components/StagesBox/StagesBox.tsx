import cn from 'classnames/bind';

import { TStageDateDescription } from '@/types/index.interface';
import styles from './StagesBox.module.css';

const cx = cn.bind(styles);

type Props = {
  stages: TStageDateDescription[];
};

/**
 * Блок графического отображения этапов и их статус.
 */
export default function StagesBox({ stages }: Props) {
  const length = stages.length;
  return (
    <div className={styles.wrapper}>
      {stages.map((stage, index) => (
        <div
          className={cx('line', {
            single: length === 1,
            first: length > 1 && index === 0,
            end: length > 1 && index === length - 1,
            [stage.status]: [stage.status],
          })}
          key={stage.stageOrder}
        />
      ))}
    </div>
  );
}
