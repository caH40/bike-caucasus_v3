import { type Metadata } from 'next';

import { generateMetadataTrails } from '@/meta/meta';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import Trails from '@/components/Trails/Trails';
import { getTrails } from '@/actions/trail';

//!!!!!!!!!!!!!!!!!!!
// export const dynamic = 'force-dynamic' делает страницу полностью динамичной!!!!!!!!
// при использовании заголовков или куки, страница становится динамической
// export const dynamic = 'force-dynamic';
// export const revalidate = 60;

// Создание динамических meta данных
export async function generateMetadata(): Promise<Metadata> {
  return await generateMetadataTrails();
}

export default async function TrailsPage() {
  return (
    <>
      <TitleAndLine hSize={1} title="Велосипедные маршруты по Кавказу" />

      <Trails getTrails={getTrails} />
    </>
  );
}
