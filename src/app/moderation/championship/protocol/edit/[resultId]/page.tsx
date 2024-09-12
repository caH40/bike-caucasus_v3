import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconResults from '@/components/Icons/IconResults';
import WrapperResultRaceEdit from '@/components/WrapperResultRaceEdit/WrapperResultRaceEdit';
import { getResultRaceForRider, putResultRaceRider } from '@/actions/result-race';

type Props = {
  params: {
    resultId: string;
  };
};

/**
 * Страница редактирования финишного результата Заезда в Чемпионате.
 */
export default async function ResultRaceEditPage({ params: { resultId } }: Props) {
  const result = await getResultRaceForRider({ resultId });

  if (!result.data) {
    return (
      <>
        <h2>Не найден запрашиваемый Результат!</h2>
        <p>{result.message}</p>
      </>
    );
  }

  return (
    <>
      <TitleAndLine hSize={1} title="Редактирование результата райдера" Icon={IconResults} />
      <WrapperResultRaceEdit result={result.data} putResultRaceRider={putResultRaceRider} />
    </>
  );
}
