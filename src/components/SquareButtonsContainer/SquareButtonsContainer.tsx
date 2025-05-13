import styles from './SquareButtonsContainer.module.css';

type Props = {
  children: React.ReactNode;
};

const SquareButtonsContainer = ({ children }: Props) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default SquareButtonsContainer;
