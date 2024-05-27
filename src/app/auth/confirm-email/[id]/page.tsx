import { errorLogger } from '@/errors/error';

const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

const fetchData = async (id: string): Promise<string> => {
  try {
    const url = `${server}/api/auth/confirm-email/${id}`;
    const response = await fetch(url, {
      cache: 'no-cache',
    });

    if (!response.ok) {
      // Обработка HTTP ошибок
      const errorText = await response.text();

      throw new Error(
        `HTTP Error: ${response.status} ${response.statusText} - ${errorText}, urlRequest:${url}`
      );
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    errorLogger(error);
    return error instanceof Error
      ? error.message
      : 'Неизвестная ошибка, обратитесь в службу поддержки!';
  }
};

export default async function ConfirmEmail({ params }: { params: { id: string } }) {
  const messageResponse = await fetchData(params.id);
  return (
    <div className="page404">
      <h1 className="page404__title">Страница активации аккаунта</h1>
      <p className="page404__text">{messageResponse}</p>
    </div>
  );
}
