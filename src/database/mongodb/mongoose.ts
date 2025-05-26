import mongoose from 'mongoose';

let isConnected = false;
/**
 * Подключение к БД МонгоДБ
 */
export async function connectToMongo() {
  try {
    if (isConnected) {
      return;
    }

    const mongoUrl = process.env.MONGODB;
    if (!mongoUrl) {
      throw new Error('Нет данных с env');
    }
    mongoose.connect(mongoUrl);
    isConnected = true;
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
}
