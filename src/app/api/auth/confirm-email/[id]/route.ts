import { confirmEmailService } from './service';

// }
type Params = {
  params: { id: string };
};

export async function GET(request: Request, { params }: Params) {
  try {
    const messageRes = await confirmEmailService(params.id);

    return Response.json({ message: messageRes });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    } else {
      return Response.json({ message: 'error on server' }, { status: 500 });
    }
  }
}
