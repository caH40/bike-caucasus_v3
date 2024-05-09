import { Dispatch, SetStateAction } from 'react';
import styles from './Checkbox.module.css';

type Props = {
  label?: string;
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  id: string;
};

/**
 * Чекбокс в виде переключателя
 */
export default function Checkbox({ label, value, setValue, id }: Props) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.checkbox} onClick={() => setValue((prev) => !prev)}>
        <input
          className={styles.input}
          type={'checkbox'}
          checked={value}
          onChange={() => setValue((prev) => !prev)} // без ругается, что якобы неконтролируемый компонент
          name={id}
          id={id}
        />
        <span className={styles.switch_left} />
        <span className={styles.switch_right} />
      </div>
    </div>
  );
}
