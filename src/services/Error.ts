/**
 * Расширение класса Error.
 */
export class ErrorCustom extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message); // Вызов конструктора в родительском классе Error.
    this.statusCode = statusCode;

    // Захват текущего стека исключений
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorCustom);
    }
  }
}
