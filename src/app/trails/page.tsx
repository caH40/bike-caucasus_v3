import { Metadata } from 'next';

import { Card as CardModel } from '@/Models/Trail';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { ICard } from '@/types/models.interface';
import Card from '@/components/Card/Card';

export const metadata: Metadata = {
  title: 'Велосипедные маршруты',
  description: 'Велосипедные маршруты по Кавказу для шоссейных и горных велосипедов',
};

const fetchTrails = async (): Promise<ICard[]> => {
  await connectToMongo();

  const trailsDB: ICard[] = await CardModel.find(
    {},
    {
      postedBy: false,
      kudoses: false,
      descPhotos: false,
      comments: false,
    }
  ).lean();

  return trailsDB;
};

export default async function TrailsPage() {
  const trails = await fetchTrails();

  return (
    <>
      <h1 style={{ color: 'red' }}>TrailsPage</h1>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '10px' }}>
        {trails.map((trail) => {
          trail._id = trail._id?.toString();

          return <Card key={String(trail._id)} trail={trail} />;
        })}
      </div>
    </>
  );
}
