import cn from 'classnames/bind';

import styles from './Pagination.module.css';
import type { TPropsPagination } from './types';

const cx = cn.bind(styles);

/**
 * Компонент PaginationFirstPages для отображения первых страниц пагинации.
 *
 * @param {TPropsPagination} props - Свойства компонента.
 * @param {number[]} props.pages - Массив номеров страниц.
 * @param {(item: number) => void} props.getClick - Функция-обработчик клика по странице.
 * @param {number} props.page - Текущая страница.
 * @returns {JSX.Element} JSX элемент.
 */
function PaginationFirstPages({ pages, getClick, page }: TPropsPagination): JSX.Element {
  const lastPage = pages.length; // Получаем номер последней страницы.

  return (
    <>
      {pages.slice(0, 5).map((pageCurrent) => (
        <li key={pageCurrent}>
          <button
            className={cx('btn', { active: page + 1 === pageCurrent })} // Добавляем класс 'active' для текущей страницы.
            onClick={() => getClick(pageCurrent)} // Обработчик клика по кнопке страницы.
          >
            {pageCurrent}
          </button>
        </li>
      ))}
      <li className={cx('item')}>
        <button className={cx('btn')}>...</button> {/* Кнопка для отображения многоточия */}
      </li>
      <li>
        <button className={cx('btn')} onClick={() => getClick(lastPage)}>
          {lastPage}
        </button>
      </li>
    </>
  );
}

export default PaginationFirstPages;

// отображение строки пагинации для страницы в начале списка
