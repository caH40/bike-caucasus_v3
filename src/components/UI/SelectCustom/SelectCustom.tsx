import type { TOptions } from '@/types/index.interface';
import styles from './SelectCustom.module.css';
import { Dispatch, SetStateAction, useState } from 'react';
import IconChevronDown from '@/components/Icons/IconChevronDown';

type Props = {
  defaultValue?: string;
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  label?: string;
  options: TOptions[];
  // icon?: React.ComponentType<TIconProps>;
};

export default function SelectCustom({ state, setState, options, label, defaultValue }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const Icon = options.find((elm) => elm.name === state)?.icon || null;
  return (
    <div className={styles.wrapper} role="select">
      <div className={styles.label}>{label}</div>
      <div className={styles.wrapper__select}>
        <button className={styles.select} onClick={() => setIsOpen(true)}>
          <div className={styles.select__name}>
            {Icon && <Icon squareSize={20} />}
            {options.find((elm) => elm.name === state)?.translation ||
              defaultValue ||
              'нет фильтров'}
          </div>

          {/* Шеврон иконка */}
          <div className={styles.select__chevron}>
            <IconChevronDown squareSize={16} />
          </div>
        </button>

        {isOpen && (
          <ul className={styles.list} onMouseLeave={() => setIsOpen(false)}>
            {/* если есть Дефолтное значение, значит заглушки в виде пустого значения не показывать */}
            {!defaultValue && (
              <li
                key={1000}
                className={styles.item}
                onClick={() => {
                  setState('нет фильтров');
                  setIsOpen(false);
                }}
              >
                {/* {option.icon && <option.icon />} */}
                {'нет фильтров'}
              </li>
            )}
            {options.map((option) => (
              <li
                key={option.id}
                className={styles.item}
                onClick={() => {
                  setState(option.name);
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
