// функции обработки строк

/**
 * Валидация форм для библиотеки react-hook-form.
 */
export class TextValidationService {
  /**
   *  Функция проверки для пробелов. Не больше одного пробела
   */
  public spaces(value: unknown) {
    // Игнорирование undefined.
    if (typeof value !== 'string') {
      return true;
    }

    // Регулярное выражение для проверки более двух пробелов подряд
    const hasMoreThanOneSpace = /\s{2,}/.test(value);
    return hasMoreThanOneSpace ? 'Текст не может содержать более одного пробела подряд' : true;
  }
}

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
   * Удаляет все пробелы, табы и переносы строк с начала и конца строки, оставив пробелы внутри текста без изменений.
   */
  trimSpaces: (input: string): string => {
    return input.trim();
  },

  /**
   * Очищает строку от HTML-тегов и убирает пробелы в начале и конце.
   * @param input Исходный текст.
   * @returns Очищенный текст без HTML-тегов и с обрезанными пробелами.
   */
  cleanText: (input: string): string => {
    return content.trimSpaces(content.stripAllHtmlTags(input));
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
  replaceWithUrl: (text: string): string =>
    text.replace(
      /((http|https):\/\/[^\s<]+)/gi,
      '<a  class="link__news" target="_blank" href="$1">$1</a>'
    ),

  /**
   * Заменяет Тэг <a> с соответствующим url на url (https://www.link.ru).
   */
  replaceWithPlainUrl: (text: string): string =>
    text.replace(/<a\s+[^>]*href="([^"]+)"[^>]*>[^<]*<\/a>/gi, '$1'),

  /**
   * Форматирование текста с html тегами для поля Textarea
   * Замена символов <br> на символ CRLF перевода строк \n.
   * Заменяет Тэг <a> с соответствующим url на url (https://www.link.ru).
   */
  formatTextForTextarea: (text: string): string => {
    const textWithReplacedBRtoCRLF = content.replaceBRtoCRLF(text);
    return content.replaceWithPlainUrl(textWithReplacedBRtoCRLF);
  },
};

/**
 * Форматирует числовые значения в удобочитаемый вид,
 * сокращая числа до трех символов и добавляя сокращения, такие как "k" для тысяч.
 */
export function formatNumberShort(num: number | undefined): string {
  if (num === undefined || num === null) {
    return '0';
  }
  if (num >= 100000) {
    return '∞'; // Бесконечность для чисел больше или равных 100,000
  } else if (num >= 10000) {
    const t = Math.trunc(num / 1000); // Округляем до ближайшего меньшего целого
    return `${t}k`;
  } else if (num >= 1000) {
    const t = Math.trunc(num / 100) / 10; // Делим на 100 и округляем до одной десятой
    return `${t}k`;
  } else {
    return num.toString(); // Для чисел меньше 1,000
  }
}

/**
 * Получения полного имени.
 */
export const getFullName = (
  rider: { firstName: string; lastName: string; patronymic?: string },
  type?: 'shortFirstName' | 'short' | 'full'
) => {
  switch (type) {
    case 'shortFirstName':
      return `${rider.firstName} ${rider.lastName}`;

    case 'short':
      return `${rider.lastName} ${rider.firstName}`;

    default:
      return `${rider.lastName} ${rider.firstName}${
        rider.patronymic ? ' ' + rider.patronymic : ''
      }`;
  }
};
