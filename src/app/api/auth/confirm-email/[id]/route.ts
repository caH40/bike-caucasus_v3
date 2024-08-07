import { errorRouteHandler } from '@/errors/error-controler';
import { confirmEmailService } from './service';
import { errorLogger } from '@/errors/error';

type Params = {
  params: { id: string };
};

export async function GET(request: Request, { params }: Params) {
  try {
    const messageRes = await confirmEmailService(params.id);

    return Response.json({ message: messageRes });
  } catch (error) {
    errorLogger(error);
    return errorRouteHandler(error, 'error on server');
  }
}
