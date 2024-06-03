import Wrapper from '@/components/Wrapper/Wrapper';
import { Trail } from '@/services/Trail';

type Props = {
  params: {
    urlSlug: string;
  };
};

export default async function TrailPage({ params }: Props) {
  const trailsService = new Trail();
  const trail = await trailsService.getOne(params.urlSlug);
  console.log(trail.data);

  return <Wrapper title={`Велосипедный маршрут ...`}>{params.urlSlug}</Wrapper>;
}
