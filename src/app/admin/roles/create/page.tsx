import IconCreate from '@/components/Icons/IconCreate';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormPermissions from '@/components/UI/Forms/FormPermissions/FormPermissions';
import Wrapper from '@/components/Wrapper/Wrapper';

type Props = {};

export default function page({}: Props) {
  return (
    <Wrapper title="Создание Роли и Разрешений" Icon={IconCreate}>
      <TitleAndLine title="Создание Разрешений" hSize={2} />
      <FormPermissions />
    </Wrapper>
  );
}
