import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { dtoWeatherForecast } from '@/dto/weather';
import { ResponseServer } from '@/types/index.interface';
import { TWeatherForecast } from '@/types/weather.types';

type PropsWeatherFromApi = {
  lat: number;
  lon: number;
  type: 'weather' | 'forecast'; // weather - текущая погода, forecast - на 5 дней.
};

/**
 * Сервис получение прогноза погоды.
 */
export class WeatherService {
  private appId: string | undefined;
  private timeoutForFetch: number;

  constructor() {
    this.timeoutForFetch = 500; // Время отмены fetch запроса, если не получен ответ fetch.
    this.appId = process.env.API_KEY_OPENWEATHERMAP; // API key для сайта openweathermap.com
  }

  async getRaw({
    lat,
    lon,
    type,
  }: PropsWeatherFromApi): Promise<ResponseServer<TWeatherForecast | null>> {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => controller.abort(), this.timeoutForFetch);

    try {
      const server = `https://api.openweathermap.org/data/2.5/${type}`;
      const query = `lat=${lat}&lon=${lon}&appid=${this.appId}&units=metric&lang=ru`;

      const response = await fetch(`${server}?${query}`, { signal });

      if (!response.ok) {
        throw new Error('Ошибка fetch при получении данных с сервера!');
      }

      const data = await response.json();

      const weatherForecast = dtoWeatherForecast(data);
      return { data: weatherForecast, ok: true, message: 'Данные погоды за 6 дней!' };
    } catch (error) {
      errorLogger(error);
      return handlerErrorDB(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
