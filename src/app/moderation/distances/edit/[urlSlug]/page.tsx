import { getServerSession } from 'next-auth';

import { getDistance, putDistance } from '@/actions/distance';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
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
  const params = await props.params;
  const session = await getServerSession(authOptions);

  // Мета данные запроса для логирования ошибок.
  const debugMeta = {
    caller: 'DistanceEditPage',
    authUserId: session?.user.id,
    rawParams: params,
    path: `/distances/${params.urlSlug}`,
  };

  const distance = await getDistance({ urlSlug: params.urlSlug, debugMeta });

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
