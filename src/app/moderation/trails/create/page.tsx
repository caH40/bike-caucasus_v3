import FormTrail from '@/components/UI/Forms/FromTrail/FormTrail';
import Wrapper from '@/components/Wrapper/Wrapper';

type Props = {};

export default function TrailsCreatePage({}: Props) {
  return (
    <Wrapper title="Создание нового маршрута">
      <FormTrail />
    </Wrapper>
  );
}
