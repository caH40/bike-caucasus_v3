import { Dispatch, SetStateAction } from 'react';
import styles from './CheckboxRounded.module.css';

type Props = {
  label?: string;
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  id: string;
};

/**
 * Чекбокс в виде круглой кнопки.
 */
export default function CheckboxRounded({ label, value, setValue, id }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.checkbox} onClick={() => setValue((prev) => !prev)}>
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
