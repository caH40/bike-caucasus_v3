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
  const hashtags = cleanedInput.split(/\s+/).filter((word) => word.length >= minLength);

  // Удаление дубликатов.
  const hashtagsSet = new Set<string>();
  for (const hash of hashtags) {
    hashtagsSet.add(hash);
  }

  return [...hashtagsSet];
}

/**
 * Преобразование текста и html.
 */
export const content = {
  /**
   * Замена символов CRLF перевода строк на html тэг <br>.
   */
  replaceCRLFtoBR: (text: string): string => {
    const regex = /\r\n|\r|\n/g;
    return text.replace(regex, '<br>');
  },

  /**
   * Замена символов <br> на символ CRLF перевода строк \n.
   */
  replaceBRtoCRLF: (text: string): string => {
    const regex = /<br>/g;
    return text.replace(regex, `\n`);
  },

  /**
   * Очистка текста от всех html тэгов кроме <a>, <br>.
   */
  stripHtmlTags: (input: string | undefined): string => {
    if (!input) {
      return '';
    }
    return input.replace(/<(?!\/?(a|br)(\s|\/?)[^>]*>)[^>]+>/gi, '');
  },

  /**
   * Очистка текста от всех html тэгов кроме <a>, <br>.
   */
  stripAllHtmlTags: (input: string): string => {
    const regex = /<\/?[^>]+(>|$)/g;
    return input.replace(regex, '');
  },

  /**
   * Заменяет url (https://www.link.ru) на Тэг <a> с соответствующим url.
   */
  replaceWithUrl: (text: string): string => {
    return text.replace(/((http|https):\/\/[^\s]+)/g, '<a  class="link" href="$1">$1</a>');
  },
};
