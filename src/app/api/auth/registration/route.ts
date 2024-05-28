import { errorLogger } from '@/errors/error';
import { postRegistrationService } from './service';
import { errorRouteHandler } from '@/errors/error-controler';

/**
 * Регистрация нового пользователя.
 */
export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      throw new Error('Нет одного или нескольких обязательных параметров для регистрации');
    }

    await postRegistrationService({ username, email, password });

    return Response.json({ message: 'Новый пользователь создан', email });
  } catch (error) {
    errorLogger(error);
    return errorRouteHandler(error, 'error on server');
  }
}
