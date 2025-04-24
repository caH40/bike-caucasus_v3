import { errorRouteHandler } from '@/errors/error-controler';
import { confirmEmailService } from './service';
import { errorLogger } from '@/errors/error';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, props: Params) {
  const params = await props.params;
  try {
    const messageRes = await confirmEmailService(params.id);

    return Response.json({ message: messageRes });
  } catch (error) {
    errorLogger(error);
    return errorRouteHandler(error, 'error on server');
  }
}
