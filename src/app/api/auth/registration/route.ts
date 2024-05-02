import { postRegistrationService } from './service';
import { errorRouteHandler } from '@/services/error-controler';

/**
 * Регистрация нового пользователя.
 */
export async function POST(req: Request) {
  try {
    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) {
      throw new Error('Нет одного или нескольких обязательных параметров для регистрации');
    }

    await postRegistrationService({ username, email, password, role });

    return Response.json({ message: 'Новый пользователь создан', email });
  } catch (error) {
    return errorRouteHandler(error, 'error on server');
  }
}
