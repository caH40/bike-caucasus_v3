import { errorRouteHandler } from '@/errors/error-controler';
import { resetPasswordService } from './service';

/**
 * Контроллер сброса пароля
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const resetPassAnswer = await resetPasswordService(email);

    return Response.json(resetPassAnswer);
  } catch (error) {
    return errorRouteHandler(error, 'Ошибка сервера при сбросе пароля');
  }
}
