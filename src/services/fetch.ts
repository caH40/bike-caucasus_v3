const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

/**
 * Функция для выполнения запросов на сервер.
 * @param {string} url - URL (только path) для отправки запроса.
 * @param {RequestInit} [options] - Дополнительные параметры запроса (опционально).
 * @returns {Promise<any>} - Промис с результатом запроса.
 */
export async function myFetch(url: string, options?: RequestInit): Promise<any> {
  if (!server) {
    return new Error('Не получен server url с переменных окружения');
  }
  console.log(`${server}${url}`, options); // eslint-disable-line

  const res = await fetch(`${server}${url}`, options);

  if (!res.ok) {
    throw new Error(`Ошибка при выполнении запроса: ${res.statusText}`);
  }

  return await res.json();
}
