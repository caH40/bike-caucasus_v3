import FormNews from '@/components/UI/Forms/FormNews/FormNews';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconNewspaper from '@/components/Icons/IconNewspaper';
import { postNews } from '@/actions/news';

/**
 * Страница создания новости
 */
export default async function NewsCreatePage() {
  return (
    <>
      <TitleAndLine title={'Создание новости'} hSize={1} Icon={IconNewspaper} />
      <FormNews postNews={postNews} />
    </>
  );
}
