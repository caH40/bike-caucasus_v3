import IconMedalBronze from './IconMedalBronze';
import IconMedalGold from './IconMedalGold';
import IconMedalSilver from './IconMedalSilver';

/**
 * Компонент отображает медали для значений 1, 2 и 3, и возвращает само значение для остальных случаев.
 * @param {number} value - Значение места в финишном протоколе.
 * @returns {JSX.Element | number} - Возвращает JSX элемент с медалью для значений 1, 2 или 3, либо возвращает само значение для других случаев.
 */
export default function Medal(value: number): JSX.Element | number {
  switch (value) {
    case 1: {
      // Возвращаем золотую медаль для значения 1
      return <IconMedalGold />;
    }
    case 2: {
      // Возвращаем серебряную медаль для значения 2
      return <IconMedalSilver />;
    }
    case 3: {
      // Возвращаем бронзовую медаль для значения 3
      return <IconMedalBronze />;
    }
    default:
      // Для всех остальных значений возвращаем само значение
      return value;
  }
}
