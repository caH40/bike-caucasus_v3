import { Dispatch, SetStateAction } from 'react';
import styles from './CheckboxRounded.module.css';

type Props = {
  label?: string;
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  id: string;
  functional?: boolean; // Использовать функциональный вызов или прямое значение.
};

/**
 * Чекбокс в виде круглой кнопки.
 */
export default function CheckboxRounded({
  label,
  value,
  setValue,
  id,
  functional = true,
}: Props) {
  const handleToggle = () => {
    if (functional) {
      setValue((prev: boolean) => !prev);
    } else {
      setValue(!value);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.checkbox} onClick={() => handleToggle()}>
        <input
          className={styles.input}
          type={'checkbox'}
          checked={value}
          onChange={(e) => setValue(e.target.checked)} // без ругается, что якобы неконтролируемый компонент
          name={id}
          id={id}
        />
        <div className={styles.box} />
      </div>

      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
