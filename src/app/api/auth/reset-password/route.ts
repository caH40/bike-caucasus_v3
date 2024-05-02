import { errorRouteHandler } from '@/services/error-controler';
import { resetPasswordService } from './service';

/**
 * Контроллер сброса пароля
 */
export async function POST(res: Response) {
  try {
    const { email } = await res.json();

    const resetPassAnswer = await resetPasswordService(email);

    return Response.json(resetPassAnswer);
  } catch (error) {
    return errorRouteHandler(error, 'Ошибка сервера при сбросе пароля');
  }
}
