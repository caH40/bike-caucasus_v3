import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconResults from '@/components/Icons/IconResults';

type Props = {
  params: {
    urlSlug: string;
  };
};

/**
 * Страница добавления/редактирования финишного протокола Заезда в Чемпионате
 */
export default async function ProtocolRaceEditPage({ params: { urlSlug } }: Props) {
  return (
    <>
      <TitleAndLine
        hSize={1}
        title="Добавление/редактирование финишного протокола Заезда в Чемпионате"
        Icon={IconResults}
      />
    </>
  );
}
