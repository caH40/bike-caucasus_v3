import cn from 'classnames/bind';

import styles from './Pagination.module.css';
import { TPropsPagination } from './types';

const cx = cn.bind(styles);

/**
 * Компонент PaginationMiddlePages для отображения строки пагинации среди страниц.
 *
 * @param {TPropsPagination} props - Свойства компонента.
 * @param {number[]} props.pages - Массив номеров страниц.
 * @param {(item: number) => void} props.getClick - Функция-обработчик клика по странице.
 * @param {number} props.page - Текущая страница.
 * @returns {JSX.Element} JSX элемент.
 */
function PaginationMiddlePages({ pages, getClick, page }: TPropsPagination): JSX.Element {
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
      {pages.slice(page - 1, page + 2).map((pageCurrent) => (
        <li key={pageCurrent}>
          <button
            className={cx('btn', { active: page === pageCurrent })} // Добавляем класс 'active' для текущей страницы.
            onClick={() => getClick(pageCurrent)} // Обработчик клика по кнопке страницы.
          >
            {pageCurrent}
          </button>
        </li>
      ))}
      <li className={cx('item')}>
        <button className={cx('btn')}>...</button>
      </li>
      <li>
        <button className={cx('btn')} onClick={() => getClick(lastPage)}>
          {lastPage}
        </button>
      </li>
    </>
  );
}

export default PaginationMiddlePages;

// отображение строки пагинации для страницы по середине списка.
