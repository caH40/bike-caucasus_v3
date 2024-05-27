import { errorRouteHandler } from '@/errors/error-controler';
import { confirmEmailService } from './service';

type Params = {
  params: { id: string };
};

export async function GET(request: Request, { params }: Params) {
  try {
    const messageRes = await confirmEmailService(params.id);

    return Response.json({ message: messageRes });
  } catch (error) {
    return errorRouteHandler(error, 'error on server');
  }
}
