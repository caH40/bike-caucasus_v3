/**
 * Формирование даты согласно локали 'ru'
 * @param date Дата в миллисекундах,строка, Date.
 * @param timeFormat Формат возвращаемой даты.
 * @param long Название месяца (true) или цифрами.
 */
export function getTimerLocal(
  date: string | number | Date,
  timeFormat: 'HM' | 'HmS' | 'DDMMYYHm' | 'DDMMYYHms' | 'DDMMYY',
  long?: boolean
) {
  const dateForFormat = new Date(date);
  if (!date || date === 0) {
    return 'Дата отсутствует...';
  }

  const formatterHourAndMinutes = new Intl.DateTimeFormat('ru', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formatterHmS = new Intl.DateTimeFormat('ru', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const formatterDDMMYY = new Intl.DateTimeFormat('ru', {
    year: '2-digit',
    month: long ? 'long' : '2-digit',
    day: '2-digit',
    weekday: long ? 'long' : undefined,
  });
  const formatterDDMMYYYY = new Intl.DateTimeFormat('ru', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const formatterDDMMYYHm = new Intl.DateTimeFormat('ru', {
    year: '2-digit',
    month: long ? 'long' : '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: long ? 'long' : undefined,
  });
  const formatterDDMMYYHms = new Intl.DateTimeFormat('ru', {
    year: '2-digit',
    month: long ? 'long' : '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: long ? 'long' : undefined,
  });

  switch (timeFormat) {
    case 'HM':
      return formatterHourAndMinutes.format(dateForFormat);
    case 'HmS':
      return formatterHmS.format(dateForFormat);
    case 'DDMMYYHm':
      return formatterDDMMYYHm.format(dateForFormat);
    case 'DDMMYYHms':
      return formatterDDMMYYHms.format(dateForFormat);
    case 'DDMMYY':
      return formatterDDMMYY.format(dateForFormat);

    default:
      return formatterDDMMYYYY.format(dateForFormat);
  }
}
