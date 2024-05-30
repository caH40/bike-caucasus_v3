import { getNewsOne } from '@/app/news/[urlSlug]/page';
import Wrapper from '@/components/Wrapper/Wrapper';

type Props = {
  params: { urlSlug: string };
};

/**
 * Страница редактирования новости.
 */
export default async function NewsEditPage({ params }: Props) {
  const { urlSlug } = params;
  const news = await getNewsOne({ urlSlug });
  console.log(news);

  return <Wrapper title="Редактирование новости">{params.urlSlug}</Wrapper>;
}
