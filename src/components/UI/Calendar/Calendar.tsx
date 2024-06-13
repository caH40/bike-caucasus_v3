'use client';

import cn from 'classnames/bind';

import styles from './Calendar.module.css';

import { getDateTime } from '@/libs/utils/calendar';
import { weekDays } from '@/constants/date';
import { useCalendarStore } from '@/store/calendar';
import BlockControlCalendar from '../BlockControlCalendar/BlockControlCalendar';
import CardEvent from '../CardEvent/CardEvent';
import { TDtoCalendarEvents } from '@/types/dto.types';

type Props = {
  events?: TDtoCalendarEvents[];
};

const cx = cn.bind(styles);

export default function Calendar({ events = [] }: Props) {
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
        {weekDays.map((weekDay) => (
          <div key={weekDay} className={styles.table__header}>
            {weekDay}
          </div>
        ))}

        {/* Ячейки дней. */}
        {calendar.map((calendarDay, index) => (
          <div
            key={index}
            className={cx('cell', {
              roundedBottomLeft: index + 1 === calendar.length - 6,
              roundedBottomRight: index + 1 === calendar.length,
              cell__active:
                calendarDay.day === getDateTime().day &&
                calendarDay.month === getDateTime().month,
            })}
          >
            {/* Хэдер в ячейки дня. */}
            <div className={styles.cell__top}>
              <div className={styles.day}>{calendarDay.day}</div>
            </div>

            {/* Карточки (плашки) с названиями событий в соответствующей дате. */}
            <div className={styles.wrapper__cards}>
              {events
                .filter((event) => event.date === calendarDay.isoDate)
                .map((event) => (
                  <CardEvent title={event.title} bgColor={'green'} key={event.id} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
