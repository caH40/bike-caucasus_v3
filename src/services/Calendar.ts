import { CalendarEvent } from '@/database/mongodb/Models/CalendarEvent';
import { dtoCalendarEvents } from '@/dto/calendar';
import { errorLogger } from '@/errors/error';
import { deserializeCalendarCreate } from '@/libs/utils/deserialization/calendar';
import { TDtoCalendarEvents } from '@/types/dto.types';
import { ResponseServer } from '@/types/index.interface';
import { TCalendarEventDocument } from '@/types/models.interface';
import { handlerErrorDB } from './mongodb/error';

/**
 * Класс сервиса работы с Календарем событий.
 */
export class CalendarService {
  private errorLogger;
  private handlerErrorDB;
  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

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

  /**
   * Получить все События из календаря.
   */
  public async getMany(): Promise<ResponseServer<TDtoCalendarEvents[] | null>> {
    try {
      const eventsDB = await CalendarEvent.find().lean<TCalendarEventDocument[]>();

      const events = dtoCalendarEvents(eventsDB);

      return { data: events, ok: true, message: 'События календаря!' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
