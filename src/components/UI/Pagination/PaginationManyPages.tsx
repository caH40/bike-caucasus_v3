import PaginationFirstPages from './PaginationFirstPages';
import PaginationLastPages from './PaginationLastPages';
import PaginationMiddlePages from './PaginationMiddlePages';
import type { TPropsPagination } from './types';

/**
 * Компонент PaginationManyPages для отображения пагинации при большом количестве страниц.
 *
 * @param {Props} props - Свойства компонента.
 * @param {number[]} props.pages - Массив номеров страниц.
 * @param {(item: '<<' | '>>' | number) => void} props.getClick - Функция для обработки клика по странице.
 * @param {number} props.page - Текущая страница.
 * @returns {JSX.Element} JSX элемент.
 */
function PaginationManyPages({ pages, getClick, page }: TPropsPagination): JSX.Element {
  const lastPage = pages.length; // Получаем номер последней страницы.
  const isMiddlePage = 4 < page && page <= lastPage - 6; // Проверяем, является ли страница "средней".
  const isLastPage = page > lastPage - 6; // Проверяем, является ли страница последней.

  return (
    <>
      {page <= 4 && <PaginationFirstPages pages={pages} getClick={getClick} page={page} />}

      {isLastPage && <PaginationLastPages pages={pages} getClick={getClick} page={page} />}

      {isMiddlePage && <PaginationMiddlePages pages={pages} getClick={getClick} page={page} />}
    </>
  );
}

export default PaginationManyPages;
