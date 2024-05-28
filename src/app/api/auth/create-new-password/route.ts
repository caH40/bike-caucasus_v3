import { errorRouteHandler } from '@/errors/error-controler';
import { createNewPasswordService } from './service';
import { errorLogger } from '@/errors/error';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const createdNewPassword = await createNewPasswordService(data);

    return Response.json(createdNewPassword);
  } catch (error) {
    errorLogger(error);
    errorRouteHandler(error, 'Ошибка при создании нового пароля');
  }
}
