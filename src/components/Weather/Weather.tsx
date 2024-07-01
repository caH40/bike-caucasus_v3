import { Fragment } from 'react';
import Image from 'next/image';

import TitleAndLine from '../TitleAndLine/TitleAndLine';
import LineSeparator from '../LineSeparator/LineSeparator';
import { getDayNameInRussian } from '@/libs/utils/calendar';
import { TWeatherForecast } from '@/types/weather.types';
import styles from './Weather.module.css';

type Props = {
  weather: TWeatherForecast;
  startLocation: string;
};

const getLinkIcon = (iconName: string) =>
  `https://openweathermap.org/img/wn/${iconName}@2x.png`;

/**
 * Блок прогноза погода на 5ть дней.
 * @param param0
 * @returns
 */
export default function Weather({ weather, startLocation }: Props) {
  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={2} title={`Прогноз погоды на старте маршрута: "${startLocation}"`} />

      {/* Погода на сегодня */}
      <div className={styles.block__today}>
        <div className={styles.day}>Сейчас</div>
        <div className={styles.box__today}>
          <Image
            src={getLinkIcon(weather.list[0].weather[0].icon)}
            width={80}
            height={80}
            alt={weather.list[0].weather[0].main}
          />
          <span className={styles.temperature__today}>
            {Math.round(weather.list[0].main.temp)}&deg;C
          </span>
        </div>
      </div>

      <LineSeparator />

      {weather.list.slice(1).map((elm) => (
        <Fragment key={elm.dt}>
          <div className={styles.block__day}>
            <div className={styles.day}>{getDayNameInRussian(elm.dt * 1000)}</div>
            <div className={styles.box__day}>
              <Image
                src={getLinkIcon(elm.weather[0].icon)}
                width={60}
                height={60}
                alt="weather"
              />

              <div className={styles.box__temperature}>
                <span className={styles.temperature__current}>
                  {Math.round(elm.main.temp)}&deg;C
                </span>
                <span className={styles.temperature__feels}>
                  {Math.round(elm.main.feels_like)}&deg;C
                </span>
              </div>

              <div className={styles.box__additional}>
                <Image src="/images/icons/wind.svg" width={16} height={16} alt="wind" />
                <div>
                  <span className={styles.humidity}>{Math.round(elm.wind.speed)}</span>
                  <span>м/с</span>
                </div>
              </div>

              <div className={styles.box__additional}>
                <Image src="/images/icons/water.svg" width={14} height={14} alt="humidity" />
                <div>
                  <span className={styles.humidity}>{elm.main.humidity}</span>
                  <span>%</span>
                </div>
              </div>
            </div>
          </div>
          <LineSeparator />
        </Fragment>
      ))}
    </div>
  );
}
