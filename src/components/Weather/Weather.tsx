import Image from 'next/image';
import TitleAndLine from '../TitleAndLine/TitleAndLine';
import styles from './Weather.module.css';
import LineSeparator from '../LineSeparator/LineSeparator';

type Props = {};

/**
 * Блок прогноза погода на 5ть дней.
 * @param param0
 * @returns
 */
export default function Weather({}: Props) {
  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={2} title="Прогноз погоды" />

      {/* Погода на сегодня */}
      <div className={styles.block__today}>
        <div className={styles.day}>Сегодня</div>
        <div className={styles.box__today}>
          <Image
            src="https://openweathermap.org/img/wn/10d@2x.png"
            width={80}
            height={80}
            alt="weather"
          />
          <span className={styles.temperature__today}>18&deg;C</span>
        </div>
      </div>

      <LineSeparator />

      <div className={styles.block__day}>
        <div className={styles.day}>Понедельник</div>
        <div className={styles.box__day}>
          <Image
            src="https://openweathermap.org/img/wn/10d@2x.png"
            width={60}
            height={60}
            alt="weather"
          />

          <div className={styles.box__temperature}>
            <span className={styles.temperature__current}>18&deg;C</span>
            <span className={styles.temperature__feels}>16&deg;C</span>
          </div>

          <div>
            <Image src="/images/icons/water.svg" width={12} height={12} alt="humidity" />
            <span className={styles.humidity}>17</span>
            <span>%</span>
          </div>
        </div>
      </div>
      <LineSeparator />
      <div className={styles.block__day}>
        <div className={styles.day}>Понедельник</div>
        <div className={styles.box__day}>
          <Image
            src="https://openweathermap.org/img/wn/10d@2x.png"
            width={60}
            height={60}
            alt="weather"
          />

          <div className={styles.box__temperature}>
            <span className={styles.temperature__current}>18&deg;C</span>
            <span className={styles.temperature__feels}>16&deg;C</span>
          </div>

          <div>
            <Image src="/images/icons/water.svg" width={12} height={12} alt="humidity" />
            <span className={styles.humidity}>17</span>
            <span>%</span>
          </div>
        </div>
      </div>
      <LineSeparator />
    </div>
  );
}
