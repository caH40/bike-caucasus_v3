import { TGetErrorsDto } from '@/types/dto.types';
import type { TLogsErrorModel } from '@/types/models.interface';

export function serviceGetErrorsDto(logs: TLogsErrorModel[]): TGetErrorsDto[] {
  return logs.map((log) => ({ ...log, _id: String(log._id) }));
}
