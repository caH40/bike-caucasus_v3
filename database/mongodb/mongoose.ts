import mongoose from 'mongoose';

/**
 * Подключение к БД МонгоДБ
 */
export async function connectToMongo() {
  try {
    const mongoUrl = process.env.MONGODB;
    if (!mongoUrl) {
      throw new Error('Нет данных с env');
    }
    mongoose.connect(mongoUrl);
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
}
