import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

/**
 * Сервис получение прогноза погоды.
 */
export class Weather {
  appId: string | undefined;
  constructor() {
    this.appId = process.env.API_KEY_OPENWEATHERMAP; // API key для сайта openweathermap.com
  }

  private async getRaw({ lat, lon }: { lat: number; lon: number }) {
    try {
      const server = 'https://api.openweathermap.org/data/2.5/forecast';
      const query = `lat=${lat}&lon=${lon}&appid=4d3a319d9897ea9e5193219be2840547&exclude=hourly&units=metric&lang=ru`;

      const response = await fetch(`${server}?${query}`);

      if (!response.ok) {
        throw new Error('Ошибка fetch при получении данных с сервера!');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      errorLogger(error);
      return handlerErrorDB(error);
    }
  }
}
