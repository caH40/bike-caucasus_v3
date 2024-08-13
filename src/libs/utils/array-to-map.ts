import { TOptions, TOptionsMap } from '@/types/index.interface';

/**
 * Преобразует массив объектов `TOptions` в `Map`, где ключом является `name`,
 *  а значением — объект с переводом и, возможно, иконкой.
 *
 * @param {TOptions[]} arr - Массив объектов.
 * @returns {TOptionsMap} `Map`, где ключами являются значения `name` из массива `arr`,
 * а значениями — объекты с `translation` и необязательной `icon`.
 */
export function arrayToMap(arr: TOptions[]): TOptionsMap {
  return new Map(
    arr.map((elm) => [
      elm.name,
      {
        translation: elm.translation,
        ...(elm.icon ? { icon: elm.icon } : {}), // добавляем `icon` только если он существует
      },
    ])
  );
}
