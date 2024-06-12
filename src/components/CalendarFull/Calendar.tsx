'use client';
// import './styles.css';
import ruLocale from '@fullcalendar/core/locales/ru';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; //
import styles from './Calendar.module.css';

type Props = {};

export default function Calendar({}: Props) {
  const handleDateClick = (arg: { dateStr: any }) => {
    alert(arg.dateStr);
  };

  return (
    <div>
      <FullCalendar
        locales={[ruLocale]}
        locale="ru"
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={handleDateClick}
        initialView="dayGridMonth"
        dayHeaderClassNames={styles.dayHeader}
        dayCellClassNames={styles.cell}
        events={[
          { title: 'event 1', date: '2024-06-11' },
          { title: 'event 2', date: '2024-06-12' },
        ]}
      />
    </div>
  );
}
