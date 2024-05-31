// import TrailCard from '@/components/TrailCard/TrailCard';

import Wrapper from '@/components/Wrapper/Wrapper';
import styles from './TrailsPage.module.css';
import { Trail } from '@/services/Trail';
import TrailCard from '@/components/TrailCard/TrailCard';

type Props = {};

export default async function TrailsPage({}: Props) {
  const trailService = new Trail();
  // const trails = await trailService.getOne('6659bb1c5a137d748f05d815');
  const trails = await trailService.getMany();

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <Wrapper title="Велосипедные маршруты по Кавказу">
          {trails.data ? (
            trails.data.map((trail) => <TrailCard trail={trail} key={trail._id} />)
          ) : (
            <div>Нет данных с сервера</div>
          )}
        </Wrapper>
      </div>
      <aside className={styles.wrapper__aside}></aside>
    </div>
  );
}
