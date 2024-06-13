// ДТО для получение данных из календаря.

import { getDateTime } from '@/libs/utils/calendar';
import { TDtoCalendarEvents } from '@/types/dto.types';
import { TCalendarEventDocument } from '@/types/models.interface';

/**
 * ДТО массива событий из календаря.
 */
export function dtoCalendarEvents(events: TCalendarEventDocument[]): TDtoCalendarEvents[] {
  return events.map((event, index) => ({
    _id: String(event._id),
    id: index,
    title: event.title,
    date: getDateTime(event.date).isoDate,
    urlSlug: event.urlSlug,
    author: String(event.author),
  }));
}
