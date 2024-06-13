import { TFormCalendar } from '@/types/index.interface';

export function deserializeCalendarCreate(formData: FormData) {
  const calendarEvent = {} as Omit<TFormCalendar, 'date'> & { date: Date } & {
    [key: string]: any;
  };

  for (const [name, value] of formData.entries()) {
    // Разбиваем имя на ключи с использованием регулярки /[\[\]]/ и фильтруем пустые строки.
    const keys = name.split(/[\[\]]/).filter(Boolean);

    keys.reduce((acc, cur, index) => {
      if (index === keys.length - 1) {
        // Если текущий индекс является последним, устанавливаем значение.
        // Последним значением передается value.

        // Восстановление типа значения.
        const handlerValue = (value: FormDataEntryValue): Date | string => {
          switch (cur) {
            // Если ключ position то возвращается число.
            case 'date':
              if (typeof value === 'string') {
                return new Date(value);
              }
              return 'нет даты';
            default:
              return String(value);
          }
        };

        acc[cur] = handlerValue(value);
      } else {
        if (!acc[cur]) {
          // Если текущий ключ не существует в объекте, создаем либо пустой объект {},
          // либо пустой массив [], в зависимости от следующего ключа.
          // при сериализации делали для массива вторым ключом число, проверка isNaN(keys[index + 1]).
          acc[cur] = isNaN(+keys[index + 1]) ? {} : [];
        }

        return acc[cur];
      }
    }, calendarEvent);
  }

  return calendarEvent as Omit<TFormCalendar, 'date'>;
}
