import { getDistance, putDistance } from '@/actions/distance';
import ContainerDistanceForms from '@/components/ClientContainers/ContainerDistanceForms/ContainerDistanceForms';
import IconDistance from '@/components/Icons/IconDistance';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

type Props = {
  params: Promise<{ urlSlug: string }>;
};

/**
 * Страница редактирование параметров дистанции.
 */
export default async function DistanceEditPage(props: Props) {
  const { urlSlug } = await props.params;

  const distance = await getDistance(urlSlug);

  if (!distance.data || !distance.message) {
    return <ServerErrorMessage message={distance.message} statusCode={distance.statusCode} />;
  }

  return (
    <>
      <TitleAndLine title="Редактирование Дистанции" hSize={1} Icon={IconDistance} />
      <ContainerDistanceForms putDistance={putDistance} distance={distance.data} />
    </>
  );
}
