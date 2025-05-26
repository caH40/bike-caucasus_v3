import { Counter } from '@/database/mongodb/Models/Counter';

import { CounterModel } from '@/types/models.interface';

/**
 * Получает следующее значение последовательности для указанного имени.
 * Если последовательности с указанным именем не существует, она будет создана.
 * @param sequenceName Имя последовательности.
 * @returns Следующее значение последовательности.
 */
export async function getNextSequenceValue(sequenceName: string) {
  const sequenceDocument: CounterModel = await Counter.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );

  if (!sequenceDocument?.sequenceValue) {
    throw new Error('Не создался id для регистрирующегося пользователя');
  }
  return sequenceDocument.sequenceValue;
}
