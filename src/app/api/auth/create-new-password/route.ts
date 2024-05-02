import { errorRouteHandler } from '@/services/error-controler';
import { createNewPasswordService } from './service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const createdNewPassword = await createNewPasswordService(data);

    return Response.json(createdNewPassword);
  } catch (error) {
    errorRouteHandler(error, 'Ошибка при создании нового пароля');
  }
}
