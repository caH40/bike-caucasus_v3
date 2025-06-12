import cn from 'classnames/bind';

import {
  getAgeCategoryBoxPosition,
  getAgeCategoryColor,
} from '@/libs/utils/championship/category';
import AgeCategoryBox from '../AgeCategoryBox/AgeCategoryBox';
import styles from './AgeCategoryScale.module.css';

// types
import { TAgeCategoriesForVisual } from '@/types/index.interface';

type Props = {
  categories: TAgeCategoriesForVisual[];
};

const cx = cn.bind(styles);

/**
 * Визуальная шкала возрастных категорий.
 */
export default function AgeCategoryScale({ categories }: Props) {
  return (
    <div className={cx('wrapper', { wrapped: categories.length > 5 })}>
      {categories.map((category, index) => (
        <AgeCategoryBox
          key={index}
          backgroundColor={getAgeCategoryColor(index)}
          position={getAgeCategoryBoxPosition(categories.length, index + 1)}
          category={category}
          isEmpty={category.isEmpty}
          isWrong={category.isWrong}
          generatedName={'...'}
        />
      ))}
    </div>
  );
}
