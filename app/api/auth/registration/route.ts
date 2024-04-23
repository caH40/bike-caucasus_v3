import { NextRequest, NextResponse } from 'next/server';
import { postRegistrationService } from './service';

/**
 * Регистрация нового пользователя.
 */
export async function POST(req: NextRequest) {
  try {
    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) {
      throw new Error('Нет одного или нескольких обязательных параметров для регистрации');
    }

    await postRegistrationService({ username, email, password, role });

    return Response.json({ message: 'Новый пользователь создан', email });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    }
    return new NextResponse('error on server', { status: 500 });
  }
}
