import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconResults from '@/components/Icons/IconResults';
import { getChampionship } from '@/actions/championship';
import { TOptions } from '@/types/index.interface';
import WrapperProtocolRace from '@/components/WrapperProtocolRace/WrapperProtocolRace';
import { postResultRaceRider } from '@/actions/protocol-race';

type Props = {
  params: {
    urlSlug: string;
  };
};

/**
 * Страница добавления/редактирования финишного протокола Заезда в Чемпионате
 */
export default async function ProtocolRaceEditPage({ params: { urlSlug } }: Props) {
  const championship = await getChampionship({ urlSlug });

  if (!championship.data) {
    return (
      <>
        <h2>Не найден запрашиваемый Чемпионат!</h2>
        <p>{championship.message}</p>
      </>
    );
  }

  const options: TOptions[] = championship.data.races.map((race) => ({
    id: race.number,
    translation: `Заезд №${race.number}: ${race.name}`,
    name: String(race.number),
  }));

  return (
    <>
      <TitleAndLine
        hSize={1}
        title="Добавление результатов райдеров для протокола Заезда"
        Icon={IconResults}
      />
      <WrapperProtocolRace
        postResultRaceRider={postResultRaceRider}
        options={options}
        championship={championship.data}
      />
    </>
  );
}
