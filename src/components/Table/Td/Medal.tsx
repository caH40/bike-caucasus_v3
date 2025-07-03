import IconMedalBronze from '../../Icons/IconMedalBronze';
import IconMedalGold from '../../Icons/IconMedalGold';
import IconMedalSilver from '../../Icons/IconMedalSilver';

import styles from './Td.module.css';

type Props = {
  position: number;
};

/**
 * Компонент отображает медали для значений 1, 2 и 3, и возвращает само значение для остальных случаев.
 */
export default function Medal({ position }: Props): JSX.Element | number {
  switch (position) {
    case 1: {
      // Возвращаем золотую медаль для значения 1
      return (
        <div className={styles.inlineBlock}>
          <IconMedalGold />
        </div>
      );
    }
    case 2: {
      // Возвращаем серебряную медаль для значения 2
      return (
        <div className={styles.inlineBlock}>
          <IconMedalSilver />
        </div>
      );
    }
    case 3: {
      // Возвращаем бронзовую медаль для значения 3
      return (
        <div className={styles.inlineBlock}>
          <IconMedalBronze />
        </div>
      );
    }
    default:
      // Для всех остальных значений возвращаем само значение
      return position;
  }
}
