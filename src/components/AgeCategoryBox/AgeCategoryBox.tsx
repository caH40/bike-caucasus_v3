import cn from 'classnames/bind';

import styles from './AgeCategoryBox.module.css';

// types
import { TAgeCategoryFromForm, TBoxPosition } from '@/types/index.interface';

type Props = {
  generatedName: string;
  category: TAgeCategoryFromForm;
  position: TBoxPosition;
  backgroundColor: string;
};

const cx = cn.bind(styles);

/**
 * Блок отображающий возрастную категорию.
 */
export default function AgeCategoryBox({
  category,
  position,
  generatedName,
  backgroundColor,
}: Props) {
  return (
    <div className={cx('wrapper')}>
      <div className={styles.numbers}>
        <span className={styles.number}>
          {category.max === 120 ? category.min + '+' : category.min}
        </span>
        <span className={styles.number}>{category.max === 120 ? '' : category.max}</span>
      </div>

      <div className={cx('box', position)} style={{ backgroundColor }}>
        <span className={styles.name}>{category.name || generatedName}</span>
      </div>
    </div>
  );
}
