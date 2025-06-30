import BlockMessage from '../BlockMessage/BlockMessage';
import styles from './ServerErrorMessage.module.css';

type Props = {
  message: string;
  statusCode?: number;
};

export default function ServerErrorMessage({ message, statusCode }: Props) {
  return (
    <BlockMessage>
      <>
        <h3 className={styles.error}>{message}</h3>
        {statusCode && <h3 className={styles.error}>{statusCode}</h3>}
      </>
    </BlockMessage>
  );
}
