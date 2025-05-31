import cn from 'classnames/bind';

import styles from './RaceSelectButtons.module.css';

const cx = cn.bind(styles);

type Props = {
  races: {
    name: string;
    id: string;
    description?: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

/**
 * Выбор заезда в виде блоков (замена select).
 */
export default function RaceSelectButtons({ races, value, onChange, error }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Выбор заезда:*</div>
      <div className={styles.wrapper__races}>
        {races.map((race) => (
          <button
            key={race.id}
            type="button"
            onClick={() => onChange(race.id)}
            className={cx('box', { active: value === race.id })}
          >
            <div className={styles.name}>{race.name}</div>
            {race.description && <div className={styles.description}>{race.description}</div>}
          </button>
        ))}
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
