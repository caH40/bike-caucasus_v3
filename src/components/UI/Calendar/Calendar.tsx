'use client';

import cn from 'classnames/bind';

import styles from './Calendar.module.css';

import { getCurrentDateTime } from '@/libs/utils/calendar';
import { weekDays } from '@/constants/date';
import { useCalendarStore } from '@/store/calendar';
import BlockControlCalendar from '../BlockControlCalendar/BlockControlCalendar';
import CardEvent from '../CardEvent/CardEvent';

const cx = cn.bind(styles);

const events = [
  {
    id: 0,
    title: 'Бермамыт',
    bgColor: 'orange',

    dateStart: '2024-6-20',
  },
  {
    id: 2,
    title: 'Бермамыт',
    bgColor: 'orange',
    dateStart: '2024-6-25',
  },
];

export default function Calendar() {
  const { dateStr, calendar } = useCalendarStore();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.box__date}>
          <div className={styles.date}>{dateStr}</div>
        </div>

        {/* Блок выбора месяца. */}
        <BlockControlCalendar />
      </div>

      {/* Календарь. */}
      <div className={styles.wrapper__table}>
        {weekDays.map((day) => (
          <div key={day} className={styles.table__header}>
            {day}
          </div>
        ))}

        {/* Ячейки дней. */}
        {calendar.map((day, index) => (
          <div
            key={index}
            className={cx('cell', {
              roundedBottomLeft: index + 1 === calendar.length - 6,
              roundedBottomRight: index + 1 === calendar.length,
              cell__active:
                day.day === getCurrentDateTime().day &&
                day.month === getCurrentDateTime().month,
            })}
          >
            {/* Хэдер в ячейки дня. */}
            <div className={styles.cell__top}>
              <div className={styles.day}>{day.day}</div>
            </div>

            {/* Карточки (плашки) с названиями событий в соответствующей дате. */}
            <div className={styles.wrapper__cards}>
              {events
                .filter((event) => {
                  console.log(event.dateStart);
                  console.log(`${day.year}-${day.month}-${day.day}`);

                  return event.dateStart === `${day.year}-${day.month}-${day.day}`;
                })
                .map((event) => (
                  <CardEvent title={event.title} bgColor={event.bgColor} key={event.id} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
