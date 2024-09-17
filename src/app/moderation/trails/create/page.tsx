import FormTrail from '@/components/UI/Forms/FromTrail/FormTrail';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconRoute from '@/components/Icons/IconRoute';
import { postTrail } from '@/actions/trail';

export default function TrailsCreatePage() {
  return (
    <>
      <TitleAndLine title="Создание нового маршрута" hSize={1} Icon={IconRoute} />
      <FormTrail postTrail={postTrail} />
    </>
  );
}
