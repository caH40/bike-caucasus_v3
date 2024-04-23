import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/auth-options';

export default async function GalleryPage() {
  const session = await getServerSession(authOptions);
  console.log(session);

  return <div>Gallery</div>;
}
