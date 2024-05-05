import { errorRouteHandler } from '@/services/error-controler';
import { fetchProfileService } from './service';

type Params = {
  params: {
    id: string;
  };
};

/**
 * Контроллер получения данных профиля пользователя
 */
export async function GET(req: Request, { params }: Params) {
  try {
    const id = +params.id;
    const profile = await fetchProfileService(id);
    return Response.json({ message: 'данные профиля', profile });
  } catch (error) {
    return errorRouteHandler(error, 'Ошибка при получении данных профиля fetchProfileService');
  }
}
