import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/auth-options';

export default async function GalleryPage() {
  const session = await getServerSession(authOptions);
  // console.log('GalleryPage', session); // eslint-disable-line

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
