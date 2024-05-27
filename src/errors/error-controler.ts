/**
 * Сервис обработки ошибок в route handlers
 */
export function errorRouteHandler(error: unknown, message: string) {
  if (error instanceof Error) {
    return Response.json(error.message, { status: 500 });
  } else {
    return Response.json(message, { status: 500 });
  }
}
