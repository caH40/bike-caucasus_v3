import { Dispatch, SetStateAction, useState } from 'react';

import type { TOptions } from '@/types/index.interface';
import styles from './InputCustom.module.css';

type Props = {
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  label?: string;
  options: TOptions[];
  id: string;
  // eslint-disable-next-line no-unused-vars
  handlerSelect: (name: string) => void;
};

/**
 * Кастомный селект.
 */
export default function InputCustom({
  state,
  id,
  setState,
  options,
  label,
  handlerSelect,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setIsOpen(true);
    setState(e.target.value);
  };

  const handlerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Действие при нажатии Enter (например, закрыть список или выбрать элемент)
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{label}</div>

      <div className={styles.wrapper__input}>
        <input
          type="text"
          className={styles.input}
          value={state}
          onChange={handlerChange}
          onKeyDown={handlerKeyDown}
          id={id}
        />

        {isOpen && (
          <ul className={styles.list} onMouseLeave={() => setIsOpen(false)}>
            {options.map((option) => (
              <li
                key={option.id}
                className={styles.item}
                onClick={() => {
                  handlerSelect(option.name);
                  setIsOpen(false);
                }}
              >
                {option.icon && <option.icon squareSize={20} />}
                {option.translation}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
