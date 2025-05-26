import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { dtoWeatherForecast } from '@/dto/weather';
import { ServerResponse } from '@/types/index.interface';
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
  }: PropsWeatherFromApi): Promise<ServerResponse<TWeatherForecast | null>> {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => controller.abort(), this.timeoutForFetch);

    try {
      const server = `https://api.openweathermap.org/data/2.5/${type}`;
      const query = `lat=${lat}&lon=${lon}&appid=${this.appId}&units=metric&lang=ru`;
      const url = `${server}?${query}`;

      const proxyServer = process.env.PROXY;
      if (!proxyServer) {
        throw new Error('Не получен адрес прокси-сервера!');
      }

      const agent = new HttpsProxyAgent(proxyServer);
      const response = await axios.get(url, {
        httpAgent: agent,
        httpsAgent: agent,
        signal,
      });

      const weatherForecast = dtoWeatherForecast(response.data);
      return { data: weatherForecast, ok: true, message: 'Данные погоды за 6 дней!' };
    } catch (error) {
      errorLogger(error);
      return handlerErrorDB(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
