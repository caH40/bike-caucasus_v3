import { DocsAfterPagination } from '@/types/index.interface';

/**
 * Получение страницы из массива документов.
 * @template T Тип элементов массива документов.
 * @param documents Массив документов.
 * @param page Номер страницы.
 * @param docsOnPage Количество документов на странице.
 * @returns Объект с данными о текущей странице и общем количестве страниц.
 */
export const getCurrentDocsOnPage = <T>(
  documents: Array<T>,
  page: number,
  docsOnPage: number
): DocsAfterPagination<T> => {
  let currentPage = page;

  // общее количество страниц с документами
  const quantityPages = Math.ceil(documents.length / docsOnPage);

  // если запрашиваемая страница page больше чем общее количество страниц quantityPages
  if (quantityPages - page <= 0) {
    currentPage = quantityPages;
  }

  const sliceStart = currentPage * docsOnPage - docsOnPage;
  const sliceEnd = docsOnPage * currentPage;
  const documentsSliced = documents.slice(sliceStart, sliceEnd);

  return { currentDocs: documentsSliced, currentPage, quantityPages };
};
