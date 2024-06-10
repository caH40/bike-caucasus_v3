import { type Metadata } from 'next';

import { Trail } from '@/services/Trail';
import { generateMetadataTrails } from '@/meta/meta';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import Trails from '@/components/Trails/Trails';
import { errorHandlerClient } from '@/actions/error-handler';
import { parseError } from '@/errors/parse';

//!!!!!!!!!!!!!!!!!!!
// export const dynamic = 'force-dynamic' делает страницу полностью динамичной!!!!!!!!
// при использовании заголовков или куки, страница становится динамической
// export const dynamic = 'force-dynamic';
// export const revalidate = 60;

// Создание динамических meta данных
export async function generateMetadata(): Promise<Metadata> {
  return await generateMetadataTrails();
}

type TGetTrails = {
  bikeType: string | null;
  region: string | null;
};

async function getTrails({ bikeType, region }: TGetTrails) {
  'use server';
  try {
    const trailService = new Trail();
    const trails = await trailService.getMany({ bikeType, region });
    return trails;
  } catch (error) {
    errorHandlerClient(parseError(error));
  }
}

export default async function TrailsPage() {
  return (
    <>
      <TitleAndLine hSize={1} title="Велосипедные маршруты по Кавказу" />

      <Trails getTrails={getTrails} />
    </>
  );
}
