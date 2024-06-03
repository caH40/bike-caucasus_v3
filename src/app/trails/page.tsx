import Wrapper from '@/components/Wrapper/Wrapper';
import { Trail } from '@/services/Trail';
import TrailCard from '@/components/TrailCard/TrailCard';
import styles from './TrailsPage.module.css';

//!!!!!!!!!!!!!!!!!!!
// export const dynamic = 'force-dynamic' делает страницу полностью динамичной!!!!!!!!
// при использовании заголовков или куки, страница становится динамической

type Props = {};

export default async function TrailsPage({}: Props) {
  const trailService = new Trail();
  const trails = await trailService.getMany();

  return (
    <Wrapper title="Велосипедные маршруты по Кавказу">
      <div className={styles.wrapper__trails}>
        {trails.data ? (
          trails.data.map((trail) => <TrailCard trail={trail} key={trail._id} />)
        ) : (
          <div>Нет данных с сервера</div>
        )}
      </div>
    </Wrapper>
  );
}
