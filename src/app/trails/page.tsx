// import TrailCard from '@/components/TrailCard/TrailCard';

import Wrapper from '@/components/Wrapper/Wrapper';
import styles from './TrailsPage.module.css';

type Props = {};

export default function TrailsPage({}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <Wrapper title="Велосипедные маршруты по Кавказу">TrailsPage</Wrapper>
      </div>
      <aside className={styles.wrapper__aside}></aside>
    </div>
  );
}
