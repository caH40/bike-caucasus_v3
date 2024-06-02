import FormTrail from '@/components/UI/Forms/FromTrail/FormTrail';
import Wrapper from '@/components/Wrapper/Wrapper';

type Props = {};

async function fetchTrailCreated(formData: FormData) {
  'use server';

  // console.log(formData);

  return { data: null, ok: false, message: 'development' };
}

export default function TrailsCreatePage({}: Props) {
  return (
    <Wrapper title="Создание нового маршрута">
      <FormTrail fetchTrailCreated={fetchTrailCreated} />
    </Wrapper>
  );
}
