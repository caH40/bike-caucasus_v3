import cn from 'classnames/bind';

import {
  getAgeCategoryBoxPosition,
  getAgeCategoryColor,
} from '@/libs/utils/championship/category';
import AgeCategoryBox from '../AgeCategoryBox/AgeCategoryBox';
import styles from './AgeCategoryScale.module.css';

// types
import { TAgeCategoryFromForm } from '@/types/index.interface';

type Props = {
  categories: TAgeCategoryFromForm[];
};

const cx = cn.bind(styles);

/**
 * Визуальная шкала возрастных категорий.
 */
export default function AgeCategoryScale({ categories }: Props) {
  const sortedCategories = categories.toSorted((a, b) => +a.min - +b.min);

  return (
    <div className={cx('wrapper', { wrapped: sortedCategories.length > 5 })}>
      {sortedCategories.map((category, index) => (
        <AgeCategoryBox
          key={index}
          backgroundColor={getAgeCategoryColor(index)}
          position={getAgeCategoryBoxPosition(sortedCategories.length, index + 1)}
          category={category}
          generatedName={'...'}
        />
      ))}
    </div>
  );
}
