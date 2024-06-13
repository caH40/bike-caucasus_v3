import { CalendarEvent } from '@/database/mongodb/Models/CalendarEvent';
import { deserializeCalendarCreate } from '@/libs/utils/deserialization/calendar';

/**
 * Класс сервиса работы с Календарем событий.
 */
export class CalendarService {
  constructor() {}

  /**
   * Добавление События в календарь.
   */
  public async addEvent(formData: FormData, author: string) {
    const event = deserializeCalendarCreate(formData);

    const response = await CalendarEvent.create({ ...event, author });

    if (!response._id) {
      throw new Error('Событие не сохранилось в БД!');
    }

    return { data: null, ok: true, message: 'Событие сохранено в БД!' };
  }
}
