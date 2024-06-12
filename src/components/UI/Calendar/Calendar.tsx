'use client';

import cn from 'classnames/bind';

import styles from './Calendar.module.css';

import { getCurrentDateTime } from '@/libs/utils/calendar';
import { weekDays } from '@/constants/date';
import { useCalendarStore } from '@/store/calendar';
import BlockControlCalendar from '../BlockControlCalendar/BlockControlCalendar';

const cx = cn.bind(styles);

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
            <div className={styles.day}>{day.day}</div>

            {/* Карточки уроков.
            <div className={styles.wrapper__cards}>
              {scheduleLessons
                .find((lesson) => lesson.month === day.month && lesson.day === day.day)
                ?.lessons.filter((lesson) => lesson.lessonName === lessonCurrent)
                .map((lesson) => (
                  <CardLesson
                    lessonName={lesson.lessonName}
                    time={lesson.time}
                    borderColorOutside={lesson.borderColorOutside}
                    borderColorInside={lesson.borderColorInside}
                    bgColor={lesson.bgColor}
                    notPaid={lesson.notPaid}
                    isLineThrough={lesson.isLineThrough}
                    key={lesson.id}
                  />
                ))}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
