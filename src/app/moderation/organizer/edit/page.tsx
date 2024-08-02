import IconOrganizers from '@/components/Icons/IconOrganizers';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

type Props = {};

export default function OrganizerEditPage({}: Props) {
  return (
    <>
      <TitleAndLine
        title="Редактирование Организатора Чемпионатов"
        hSize={1}
        Icon={IconOrganizers}
      />
    </>
  );
}
