/**
 * Определяет позицию кнопки в группе кнопок по индексу.
 *
 * Возвращает `'left'`, `'center'` или `'right'` в зависимости от положения кнопки:
 * - `'left'` — если это первая кнопка (index === 0),
 * - `'center'` — если это промежуточная кнопка (не первая и не последняя, при количестве > 2),
 * - `'right'` — если это последняя кнопка или всего 2 кнопки.
 *
 * @param index - Индекс текущей кнопки в группе (начинается с 0).
 * @param quantityButtonsInterval - Общее количество кнопок в группе.
 * @returns Положение кнопки: `'left'` | `'center'` | `'right'`.
 
 */
export function getPosition(
  index: number,
  quantityButtonsInterval: number
): 'left' | 'center' | 'right' {
  if (index === 0) {
    return 'left';
  } else if (
    index !== 0 &&
    quantityButtonsInterval > 2 &&
    index + 1 !== quantityButtonsInterval
  ) {
    return 'center';
  } else {
    return 'right';
  }
}
