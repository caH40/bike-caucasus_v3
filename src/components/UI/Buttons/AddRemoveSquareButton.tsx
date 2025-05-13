import Image from 'next/image';

import styles from './Buttons.module.css';

type Props = {
  actionFunction: () => void;
  action: 'delete' | 'add';
  alt?: string;
};

/**
 * Кнопка с иконкой добавления или удаления сущности.
 */
const AddRemoveSquareButton = ({ actionFunction, action, alt }: Props) => {
  const altText = alt ?? (action === 'add' ? 'Добавить' : 'Удалить');

  return (
    <button onClick={() => actionFunction()} className={styles.btn} type="button">
      <Image
        width={26}
        height={22}
        src={`/images/icons/${action}-square.svg`}
        alt={altText}
        className={styles.icon__img}
      />
    </button>
  );
};

export default AddRemoveSquareButton;
