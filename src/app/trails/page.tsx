import Wrapper from '@/components/Wrapper/Wrapper';
import { Trail } from '@/services/Trail';
import TrailCard from '@/components/TrailCard/TrailCard';
import styles from './TrailsPage.module.css';

type Props = {};

export default async function TrailsPage({}: Props) {
  const trailService = new Trail();
  const trails = await trailService.getMany();

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <Wrapper title="Велосипедные маршруты по Кавказу">
          <div className={styles.wrapper__trails}>
            {trails.data ? (
              trails.data.map((trail) => <TrailCard trail={trail} key={trail._id} />)
            ) : (
              <div>Нет данных с сервера</div>
            )}
          </div>
        </Wrapper>
      </div>
      <aside className={styles.wrapper__aside}></aside>
    </div>
  );
}
