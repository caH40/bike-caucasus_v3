import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

import '../fonts/base64/roboto-bold';
import '../fonts/base64/roboto-regular';
import { TRaceRegistrationDto } from '@/types/dto.types';
import { getDateTime } from '../utils/calendar';
import { registrationStatusMap } from '@/constants/championship';

type jsPDFCustom = jsPDF & {
  // eslint-disable-next-line no-unused-vars
  autoTable: (options: UserOptions) => void;
};

type Params = {
  data: TRaceRegistrationDto[];
  subTitles: string[];
};

const columns = [
  {
    accessorKey: 'index',
    header: '#',
  },
  {
    header: 'Номер',
    accessorKey: 'startNumber',
  },
  {
    header: 'Участник',
    accessorKey: 'rider',
  },
  {
    header: 'Команда',
    accessorKey: 'rider.team',
  },
  {
    header: 'Город',
    accessorKey: 'rider.city',
  },
  {
    header: 'Год рождения',
    accessorKey: 'rider.yearBirthday',
  },
  {
    header: 'Статус',
    accessorKey: 'status',
  },
  {
    header: 'Дата',
    accessorKey: 'createdAt',
  },
];

/**
 *  Скачивание PDF файла таблицы.
 */
export const getPdfRegistered = ({ data, subTitles }: Params) => {
  const doc = new jsPDF() as jsPDFCustom;

  // Установка шрифта для заголовка
  doc.setFont('Roboto-Bold', 'normal');
  doc.setFontSize(18);
  doc.text('Список зарегистрированных участников', 14, 16);

  doc.setFont('Roboto-Regular', 'normal');
  doc.setFontSize(15);
  // Отрисовка строк из массива, высота строки 8мм.
  let startY = 24;
  subTitles.forEach((elm) => {
    doc.text(elm, 14, startY);
    startY += 7;
  });

  // Формируем заголовки таблицы
  const headers = columns.map((col) => (typeof col.header === 'string' ? col.header : ''));

  // Формируем данные для таблицы
  const body = data.map((row, indexRow) => {
    return columns.map((col) => {
      // Используем switch для обработки различных колонок
      switch (col.accessorKey) {
        case 'index':
          return indexRow + 1;

        case 'startNumber':
          return row.startNumber || '';

        case 'rider':
          // Обрабатываем колонку "Участник"
          return `${row.rider.firstName} ${row.rider.lastName}`;

        case 'rider.city':
          // Обрабатываем колонку "Город"
          return row.rider.city || 'н/д';

        case 'rider.yearBirthday':
          // Обрабатываем колонку "Год рождения"
          return row.rider.yearBirthday;

        case 'rider.team':
          // Обрабатываем колонку "Команда"
          return row.rider.team || 'н/д';

        case 'status':
          // Обрабатываем колонку "Статус"
          return registrationStatusMap.get(row.status)?.translation || 'н/д';

        case 'createdAt':
          // Обрабатываем колонку "Дата"
          return getDateTime(new Date(row.createdAt)).dateDDMMYYYY;

        default:
          return 'н/д';
      }
    });
  });

  const lastIndex = body.length;
  // Создание пустой строки.
  const row = (i: number) => columns.map((_: any, index: number) => (index === 0 ? i : ''));
  // Добавление пустых строк в таблицу.
  const quantityRowEmpty = 22;
  for (let i = lastIndex + 1; i < quantityRowEmpty; i++) {
    body.push(row(i));
  }

  // Добавляем таблицу в PDF
  doc.autoTable({
    head: [headers],
    body: body,
    startY: startY, // Стартовая позиция по Y для таблицы.
    styles: {
      font: 'Roboto-Regular',
      fontSize: 10,
      lineColor: [150, 150, 150], // Цвет линий бордера (черный)
      lineWidth: 0.05, // Толщина линий бордера
    },
    headStyles: {
      fillColor: [49, 141, 44], // Цвет фона для заголовков.
      textColor: [0, 0, 0], // Цвет текста для заголовков.
    },
    bodyStyles: {
      textColor: [0, 0, 0], // Цвет текста для тела таблицы.
    },
    columnStyles: {
      0: { cellWidth: 10, minCellHeight: 10 }, // Ширина для первого столбца (например, индекс)
      1: { cellWidth: 10 }, // Ширина для второго столбца (например, номер)
      2: { cellWidth: 45 }, // Ширина для третьего столбца (например, участник)
      3: { cellWidth: 30 }, // Ширина для четвертого столбца (например, команда)
      4: { cellWidth: 30 }, // Ширина для пятого столбца (например, город)
      5: { cellWidth: 15 }, // Ширина для шестого столбца (например, год рождения)
      6: { cellWidth: 20 }, // Ширина для седьмого столбца (например, статус)
      7: { cellWidth: 25 }, // Ширина для восьмого столбца (например, дата)
    },
    alternateRowStyles: {
      fillColor: [245, 255, 245], // Светло-синий цвет для чередующихся строк
    },
    theme: 'plain', // Использование сетки для отображения границ
  });

  // Сохранение PDF
  doc.save('registered-riders.pdf');
};
