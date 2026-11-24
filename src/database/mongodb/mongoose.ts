'use server';

import mongoose from 'mongoose';

import '@/database/mongodb/Models/Distance';

let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Подключение к БД МонгоДБ.
 * Соединение кэшируется промисом: параллельные вызовы ждут один и тот же коннект,
 * неудачная попытка сбрасывает кэш, чтобы следующий запрос попробовал снова.
 */
export async function connectToMongo() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    const mongoUrl = process.env.MONGODB;
    if (!mongoUrl) {
      throw new Error('Нет данных с env');
    }

    connectionPromise = mongoose
      .connect(mongoUrl, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      })
      .catch((error: unknown) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
}
