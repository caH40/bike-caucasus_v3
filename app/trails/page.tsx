import { Metadata } from 'next';
import { Card } from '../../database/mongodb/Models/Trail';
import { connectToMongo } from '../../database/mongodb/mongoose';
import { ICard } from '../../types/models.interface';

export const metadata: Metadata = {
  title: 'Велосипедные маршруты',
  description: 'Велосипедные маршруты по Кавказу для шоссейных и горных велосипедов',
};

const fetchTrails = async (): Promise<ICard[]> => {
  await connectToMongo();
  const trailsDB: ICard[] = await Card.find().lean();
  return trailsDB;
};

export default async function TrailsPage() {
  const trails = await fetchTrails();

  return (
    <div>
      {trails.map((trail) => (
        <div key={String(trail._id)}>{trail.nameRoute}</div>
      ))}
    </div>
  );
}
