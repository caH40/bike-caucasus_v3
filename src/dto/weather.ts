import { TWeatherForecast, TWeatherForecastItem } from '@/types/weather.types';

export function dtoWeatherForecast(weather: TWeatherForecast): TWeatherForecast {
  const daily = getDailyForecasts(weather);

  return {
    ...weather,
    list: daily,
  };
}

/**
 * Фильтрация прогнозов погоды, оставляется ближайший прогноз на сегодняшний день,
 * остальные прогнозы на 12:00 каждого дня.
 */
function getDailyForecasts(weatherData: TWeatherForecast): TWeatherForecastItem[] {
  const dailyForecasts: TWeatherForecastItem[] = [weatherData.list[0]];
  const processedDates = new Set<string>(weatherData.list[0].dt_txt.split(' ')[1]);

  for (const forecast of weatherData.list) {
    const date = forecast.dt_txt.split(' ')[0];
    const time = forecast.dt_txt.split(' ')[1];

    // Если прогноз для данного дня еще не добавлен и время около полудня
    if (!processedDates.has(date) && time === '09:00:00') {
      dailyForecasts.push(forecast);
      processedDates.add(date);
    }
  }

  return dailyForecasts;
}
