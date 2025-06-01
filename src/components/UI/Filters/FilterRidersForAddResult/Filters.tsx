'use client';

import ButtonForFilter from '../ButtonForFilter/ButtonForFilter';
import { TOptions } from '@/types/index.interface';

type Props = {
  buttons: TOptions[];
  activeIdBtn: number;
  setActiveIdBtn: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * Выбор полей ввода: Зарегистрированные райдеры, Поиск Райдеров из БД, Ручной ввод всех данных.
 */
export default function FilterRidersForAddResult({
  activeIdBtn,
  setActiveIdBtn,
  buttons,
}: Props) {
  const quantityButtonsInterval = buttons.length;
  const position = (index: number, quantityButtonsInterval: number) => {
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
  };

  return (
    <nav>
      {buttons.map((button, index) => {
        return (
          <ButtonForFilter
            key={button.id}
            id={button.id}
            position={position(index, quantityButtonsInterval)}
            active={button.id === activeIdBtn}
            setActiveIdBtn={setActiveIdBtn}
          >
            {button.translation}
          </ButtonForFilter>
        );
      })}
    </nav>
  );
}
