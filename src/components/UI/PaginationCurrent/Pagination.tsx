import { type Updater } from '@tanstack/react-table';
import cn from 'classnames/bind';

import PaginationManyPages from './PaginationManyPages';
import styles from './Pagination.module.css';

const cx = cn.bind(styles);

/**
 * Типизация пропсов для компонента Pagination.
 *
 * @typedef {Object} Props
 * @property isFirstPage - Флаг, указывающий на то, является ли текущая страница первой.
 * @property isLastPage - Флаг, указывающий на то, является ли текущая страница последней.
 * @property quantityPages - Общее количество страниц.
 * @property page - Текущая страница.
 * @property setPage - Функция для обновления текущей страницы.
 */
type Props = {
  isFirstPage: boolean;
  isLastPage: boolean;
  quantityPages: number;
  page: number;
  // eslint-disable-next-line no-unused-vars
  setPage: (updater: Updater<number>) => void;
};

/**
 * Компонент Pagination для отображения навигации по страницам.
 * !!! Данная реализация пагинации работает, если нумерация страниц начинается с 1.
 *
 * @param {Props} props - Свойства компонента.
 * @returns {JSX.Element} JSX элемент.
 */
const Pagination = ({
  quantityPages,
  page,
  setPage,
  isFirstPage,
  isLastPage,
}: Props): JSX.Element => {
  // Создаем массив страниц от 1 до quantityPages.
  const pages = Array(quantityPages)
    .fill('')
    .map((_, index) => index + 1);

  /**
   * Обработчик клика по кнопке навигации.
   *
   * @param {'<<' | '>>' | number} item - Значение кнопки ('<<', '>>' или номер страницы).
   */
  const getClick = (item: '<<' | '>>' | number): void => {
    if (item === '<<' && page === 1) {
      return; // Если текущая страница первая, ничего не делаем.
    }

    if (item === '<<') {
      setPage((prev) => prev - 1); // Переход на предыдущую страницу.
      return;
    }

    if (item === '>>' && quantityPages === page) {
      return; // Если текущая страница последняя, ничего не делаем.
    }

    if (item === '>>') {
      setPage((prev) => prev + 1); // Переход на следующую страницу.
      return;
    }

    if (typeof item === 'number') {
      setPage(item); // Переход на выбранную страницу.
      return;
    }
    setPage(1); // Переход на первую страницу.
  };

  return (
    <nav className={cx('navigation')}>
      <ul className={cx('list')}>
        <li>
          <button className={cx('btn')} onClick={() => getClick('<<')} disabled={isFirstPage}>
            {'<<'}
          </button>
        </li>
        {/* Если страниц больше 7, то используем компонент PaginationManyPages */}
        {pages.length > 7 ? (
          <PaginationManyPages pages={pages} page={page} getClick={getClick} />
        ) : (
          pages.map((pageCurrent) => (
            <li
              className={cx('item', { active: page === pageCurrent })}
              onClick={() => getClick(pageCurrent)}
              key={pageCurrent}
            >
              <button className={cx('btn')} onClick={() => getClick(pageCurrent)}>
                {pageCurrent}
              </button>
            </li>
          ))
        )}
        <li>
          <button className={cx('btn')} onClick={() => getClick('>>')} disabled={isLastPage}>
            {'>>'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
