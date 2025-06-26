import { postDistance } from '@/actions/championship';
import ContainerDistanceForms from '@/components/ClientContainers/ContainerDistanceForms/ContainerDistanceForms';
import IconDistance from '@/components/Icons/IconDistance';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

/**
 * Страница создания дистанции.
 */
export default async function DistanceCreatePage() {
  return (
    <>
      <TitleAndLine title="Создание Дистанции" hSize={1} Icon={IconDistance} />
      <ContainerDistanceForms postDistance={postDistance} />
    </>
  );
}
