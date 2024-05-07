import { errorRouteHandler } from '@/services/error-controler';

import { fetchProfileService } from '../../profile/[id]/service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const profile = await fetchProfileService({ email, isPublic: false });

    return Response.json({ message: 'данные из контроллера', profile });
  } catch (error) {
    return errorRouteHandler(error, 'Ошибка в контроллере получения настроек аккаунта профиля');
  }
}
