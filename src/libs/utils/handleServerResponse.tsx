import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import { ServerResponse } from '@/types/index.interface';

/**
 * Универсальный хелпер для обработки ответа от сервера.
 * Если ответ `ok === false` или `data` отсутствует, возвращается компонент `ServerErrorMessage`,
 * который можно сразу отрендерить в React.
 * Если ответ успешен, возвращаются типизированные `data`.
 *
 * @param response - Объект ответа от сервера (типа ServerResponse<T | null>)
 * @returns Либо `T` (успешные данные), либо JSX-элемент с сообщением об ошибке.
 */
export function handleServerResponse<T>(response: ServerResponse<T | null>): T | JSX.Element {
  if (!response.ok || !response.data) {
    return <ServerErrorMessage message={response.message} statusCode={response.statusCode} />;
  }

  return response.data;
}
