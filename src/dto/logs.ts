import { TGetErrorsDto } from '@/types/dto.types';
import type { TLogsErrorModel } from '@/types/models.interface';

/**
 * Преобразует массив логов ошибок в массив DTO с дополнительными полями id и строковым _id.
 * @param {TLogsErrorModel[]} logs - Массив логов ошибок.
 * @returns {TGetErrorsDto[]} - Преобразованный массив DTO ошибок.
 */
export function serviceGetErrorsDto(logs: TLogsErrorModel[]): TGetErrorsDto[] {
  // Преобразование массива логов с добавлением поля id и преобразованием _id в строку.
  return logs.map((log, index) => ({ ...log, id: index + 1, _id: String(log._id) }));
}

/**
 * Преобразует лог ошиби в DTO с преобразованным значением _id в строку.
 * @param {TLogsErrorModel} log - Лог ошибки.
 * @returns {TGetErrorsDto} - Преобразованный массив DTO ошибок.
 */
export function serviceGetErrorDto(log: TLogsErrorModel): TGetErrorsDto {
  // Преобразование массива логов с добавлением поля id и преобразованием _id в строку.
  return { ...log, id: 1, _id: String(log._id) };
}
