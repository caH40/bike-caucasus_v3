import { errorLogger } from '@/errors/error';
import { errorRouteHandler } from '@/errors/error-controler';

import { YooKassaNotification } from '@/services/YooKassaNotification';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // или req.json(), если это JSON

    if (body) {
      const paymentService = new YooKassaNotification();
      await paymentService.handleNotifications(body);
    }

    return new Response('ok', { status: 200 });
  } catch (error) {
    errorLogger(error);
    return errorRouteHandler(error, 'Ошибка при обработке уведомления с ЮКассы.');
  }
}
