import styles from './ButtonClose.module.css';

type Props = {
  getClick: () => void;
};

const ButtonClose = ({ getClick }: Props) => {
  return <button onClick={getClick} className={styles.btn} type="button" />;
};

export default ButtonClose;
