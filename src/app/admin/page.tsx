import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/auth-options';
import Template from './Template';

import { Cloud } from '@/services/cloud';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.idDB || !session.user.id) {
    return <h1>Не получен id пользователя</h1>;
  }

  const handlerAction = async () => {
    'use server';

    const cloud = new Cloud('vk');
    const name = 'загру';

    const response = await cloud.deleteFiles('bike-caucasus', name);

    return response;
  };

  return (
    <div>
      <Template handlerAction={handlerAction} />
    </div>
  );
}
