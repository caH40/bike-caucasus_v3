'use client';

import ButtonForFilter from '../ButtonForFilter/ButtonForFilter';
import { TOptions } from '@/types/index.interface';
import { getPosition } from '../utils';

type Props = {
  buttons: TOptions[];
  activeIdBtn: number;
  setActiveIdBtn: ((id: number) => void) | React.Dispatch<React.SetStateAction<number>>;
  hiddenButtonNames: string[];
};

/**
 * Выбор форм для заполнения данных чемпионата.
 */
export default function ChampionshipFormNavigation({
  activeIdBtn,
  setActiveIdBtn,
  buttons,
  hiddenButtonNames,
}: Props) {
  const visibleButtons = buttons.filter((button) => !hiddenButtonNames.includes(button.name));

  return (
    <nav>
      {visibleButtons.map((button, index) => {
        return (
          <ButtonForFilter
            key={button.id}
            id={button.id}
            position={getPosition(index, visibleButtons.length)}
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
