import { getChampionship } from '@/actions/championship';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { getTitle } from './utils';
import FormRaceRegistration from '@/components/UI/Forms/FormRaceRegistration/FormRaceRegistration';
import styles from './Registration.module.css';

type Props = {
  params: {
    champName: string;
  };
};

export default async function Registration({ params: { champName } }: Props) {
  const { data: championship } = await getChampionship({ urlSlug: champName });
  if (!championship) {
    return <h2>Не получены данные с сервера о Чемпионате </h2>;
  }

  return (
    <div className={styles.wrapper}>
      <TitleAndLine
        hSize={1}
        title={getTitle({
          name: championship.name,
          parentChampionship: championship.parentChampionship,
          type: championship.type,
          stage: championship.stage,
        })}
      />

      {/* <TitleAndLine hSize={2} title="Выбор заезда" /> */}

      <FormRaceRegistration championshipId={championship._id} races={championship.races} />
    </div>
  );
}
