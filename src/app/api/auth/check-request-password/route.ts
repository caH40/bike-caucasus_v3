import { errorRouteHandler } from '@/services/error-controler';
import { checkRequestPasswordService } from './service';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data?.id) {
      throw new Error('Ошибка при проверке на сброс пароля');
    }

    const userId = await checkRequestPasswordService(data.id);

    return Response.json({
      message: 'Запрос на сброс пароля актуальный!',
      userId,
    });
  } catch (error) {
    return errorRouteHandler(error, 'Ошибка при проверке на сброс пароля');
  }
}
