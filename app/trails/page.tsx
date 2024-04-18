import { Metadata } from 'next';
import { Card } from '../../database/mongodb/model/Trail';
import { connectToMongo } from '../../database/mongodb/mongoose';

export const metadata: Metadata = {
  title: 'Велосипедные маршруты',
  description: 'Велосипедные маршруты по Кавказу для шоссейных и горных велосипедов',
};

const fetchTrails = async () => {
  await connectToMongo();
  const trailsDB = await Card.find().lean();
  return trailsDB;
};

export default async function TrailsPage() {
  const trails = await fetchTrails();

  console.log(trails.length);

  return <div>TrailPage</div>;
}
