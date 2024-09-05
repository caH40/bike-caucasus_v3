import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import styles from './BlockSearchRider.module.css';

type Props = {};

/**
 * Блок выбора зарегистрированного в Заезде райдера.
 */
export default function BlockSearchRider({}: Props) {
  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={3} title="Поиск райдера в Базе данных сайта" />
    </div>
  );
}
