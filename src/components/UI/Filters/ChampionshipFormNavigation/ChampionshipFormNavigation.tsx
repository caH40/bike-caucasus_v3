'use client';

import ButtonForFilter from '../ButtonForFilter/ButtonForFilter';
import { TOptions } from '@/types/index.interface';
import { getPosition } from '../utils';

type Props = {
  buttons: TOptions[];
  activeIdBtn: number;
  setActiveIdBtn: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * Выбор форм для заполнения данных чемпионата.
 */
export default function ChampionshipFormNavigation({
  activeIdBtn,
  setActiveIdBtn,
  buttons,
}: Props) {
  return (
    <nav>
      {buttons.map((button, index) => {
        return (
          <ButtonForFilter
            key={button.id}
            id={button.id}
            position={getPosition(index, buttons.length)}
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
