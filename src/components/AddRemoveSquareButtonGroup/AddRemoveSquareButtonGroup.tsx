import styles from './AddRemoveSquareButtonGroup.module.css';

type Props = {
  children: React.ReactNode;
  label: string;
};

/**
 * Обёртка для иконок удаления/добавления компонентов.
 */
const AddRemoveSquareButtonGroup = ({ children, label }: Props) => {
  return (
    <div className={styles.wrapper}>
      {children}
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default AddRemoveSquareButtonGroup;
