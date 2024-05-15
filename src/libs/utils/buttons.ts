/**
 * Функция для определения позиции элемента в списке.
 * @param length - Длина списка.
 * @param Индекс элемента в списке.
 * @returns Позиция элемента ('solo', 'top', 'bottom') или null.
 */
export const handlerPosition = (length: number, index: number): string | null => {
  // Если список состоит из одного элемента, позиция - 'solo'.
  if (length === 1) {
    return 'solo';
  }
  // Если список состоит из двух элементов, позиция - 'top' для первого элемента и 'bottom' для второго.
  if (length === 2) {
    return index === 0 ? 'top' : 'bottom';
  }
  // Если элемент первый в списке, позиция - 'top'.
  if (index === 0) {
    return 'top';
  }
  // Если элемент последний в списке, позиция - 'bottom'.
  else if (index === length - 1) {
    return 'bottom';
  }
  // В остальных случаях позиция не определяется.
  return null;
};
