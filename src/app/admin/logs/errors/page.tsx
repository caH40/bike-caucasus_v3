import { Logger } from '@/services/logger';
import type { TGetErrorsDto } from '@/types/dto.types';
import type { ResponseServer } from '@/types/index.interface';

async function getLogsError(): Promise<ResponseServer<TGetErrorsDto[] | null>> {
  const logger = new Logger();

  const response = await logger.getErrors();

  return response;
}

export default async function LogsErrorsPage() {
  const logsData = await getLogsError();
  return (
    <div>
      <pre>{JSON.stringify(logsData, null, 2)}</pre>
    </div>
  );
}
