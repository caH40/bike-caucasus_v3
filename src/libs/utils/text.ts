// функции обработки строк

/**
 * Создает массив хэштэгов из предложения, разделение происходит по символам и пробелам.
 */
export function getHashtags(hashtag: string): string[] {
  const minLength = 3;
  // Регулярное выражение для замены всех символов, кроме букв латиницы,
  // кириллицы, цифр и пробелов
  const cleanedInput = hashtag.replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s]/g, ' ');

  // Разделение строки по пробелам и фильтрация пустых элементов
  const words = cleanedInput.split(/\s+/).filter((word) => word.length >= minLength);

  return words;
}
