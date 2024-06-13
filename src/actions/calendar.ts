'use server';

import { CalendarService } from '@/services/Calendar';
import type { TDtoCalendarEvents } from '@/types/dto.types';

export async function getCalendarEvents(): Promise<TDtoCalendarEvents[]> {
  try {
    const calendarService = new CalendarService();
    const events = await calendarService.getMany();

    return events.data || [];
  } catch (error) {
    // В случае ошибки возвращаем пустой массив. Нет нужды в обработке ошибки.
    // Если была ошибка, то она сохраняется в логах сервера.
    return [];
  }
}
