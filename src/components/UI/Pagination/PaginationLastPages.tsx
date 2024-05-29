import cn from 'classnames/bind';

import styles from './Pagination.module.css';
import type { TPropsPagination } from './types';

const cx = cn.bind(styles);

/**
 * Компонент PaginationLastPages для отображения последних страниц пагинации.
 *
 * @param {TPropsPagination} props - Свойства компонента.
 * @param {number[]} props.pages - Массив номеров страниц.
 * @param {(item: number) => void} props.getClick - Функция-обработчик клика по странице.
 * @param {number} props.page - Текущая страница.
 * @returns {JSX.Element} JSX элемент.
 */
function PaginationLastPages({ pages, getClick, page }: TPropsPagination): JSX.Element {
  const lastPage = pages.length; // Получаем номер последней страницы.

  return (
    <>
      <li className={cx('item')}>
        <button className={cx('btn')} onClick={() => getClick(1)}>
          1
        </button>
      </li>
      <li className={cx('item')}>
        <button className={cx('btn')}>...</button>
      </li>
      {pages.slice(lastPage - 5).map((pageCurrent) => (
        <li key={pageCurrent}>
          <button
            className={cx('btn', { active: page + 1 === pageCurrent })} // Добавляем класс 'active' для текущей страницы.
            onClick={() => getClick(pageCurrent)} // Обработчик клика по кнопке страницы.
          >
            {pageCurrent}
          </button>
        </li>
      ))}
    </>
  );
}

export default PaginationLastPages;

// отображение строки пагинации для страницы в конце списка.
