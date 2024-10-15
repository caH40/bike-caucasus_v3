import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

import '../fonts/base64/roboto-bold';
import '../fonts/base64/roboto-regular';
import { TProtocolRace } from '@/types/index.interface';
import { formatTimeToStr } from '../utils/timer';
import { GapTimeFormatter } from '../utils/gaptoseconds';
import { replaceCategorySymbols } from '../utils/championship';

type jsPDFCustom = jsPDF & {
  // eslint-disable-next-line no-unused-vars
  autoTable: (options: UserOptions) => void;
};

type Params = {
  data: TProtocolRace;
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
    header: 'Финишное время',
    accessorKey: 'raceTimeInMilliseconds',
  },
  {
    header: 'Отс. от лидера',
    accessorKey: 'gapsInCategories.absolute.toLeader',
  },
  {
    header: 'Отс. от пред.',
    accessorKey: 'gapsInCategories.absolute.toPrev',
  },
  {
    header: 'Команда',
    accessorKey: 'team',
  },
  {
    header: 'Город',
    accessorKey: 'city',
  },
  {
    header: 'Категория',
    accessorKey: 'categoryAge',
  },
];

/**
 *  Скачивание PDF файла финишного протокола заезда Чемпионата.
 */
export const getPdfProtocolRace = ({ data, subTitles }: Params) => {
  const headers = columns.map((col) => (typeof col.header === 'string' ? col.header : ''));

  let startY = 24;

  const doc = new jsPDF() as jsPDFCustom;

  doc.setFont('Roboto-Bold', 'normal');
  doc.setFontSize(18);
  doc.text('Итоговые протоколы', 70, 16);

  doc.setFont('Roboto-Regular', 'normal');
  doc.setFontSize(13);

  subTitles.forEach((elm) => {
    doc.text(elm, 14, startY);
    startY += 6;
  });
  startY += 2;

  // Формирование тела таблиц.
  ['Общая', ...data.categories].forEach((category) => {
    const protocolCurrent = data.protocol.filter((result) => {
      // Для общего протокола возвращаются все результаты.
      if (category === 'Общая') {
        return true;
      }

      // Фильтрация результатов для определенной категории.
      return result.categoryAge === category;
    });

    const body = protocolCurrent.map((row, indexRow) => {
      return columns.map((col) => {
        switch (col.accessorKey) {
          case 'index':
            return indexRow + 1;
          case 'startNumber':
            return row.startNumber || '';
          case 'rider':
            return `${row.profile.firstName} ${row.profile.lastName}`;
          case 'raceTimeInMilliseconds':
            return formatTimeToStr(row.raceTimeInMilliseconds);
          case 'gapsInCategories.absolute.toLeader':
            return GapTimeFormatter.getGapsInProtocol(
              row.gapsInCategories.absolute?.toLeader ?? 0
            );
          case 'gapsInCategories.absolute.toPrev':
            return GapTimeFormatter.getGapsInProtocol(
              row.gapsInCategories.absolute?.toPrev ?? 0
            );
          case 'city':
            return row.profile.city || 'н/д';
          case 'categoryAge':
            return replaceCategorySymbols(row.categoryAge);
          case 'team':
            return row.profile.team || '';
          default:
            return 'н/д';
        }
      });
    });

    // Добавление название таблицы.
    doc.setFontSize(13);
    doc.text(`Категория: ${replaceCategorySymbols(category, true)}`, 14, startY);
    startY += 3;

    doc.autoTable({
      head: [headers],
      body: body,
      startY: startY,
      styles: {
        font: 'Roboto-Regular',
        fontSize: 10,
        lineColor: [150, 150, 150],
        lineWidth: 0.05,
      },
      headStyles: {
        fillColor: [49, 141, 44],
        textColor: [0, 0, 0],
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 10, minCellHeight: 10 },
        1: { cellWidth: 10 },
        2: { cellWidth: 40 },
        3: { cellWidth: 22 },
        4: { cellWidth: 16 },
        5: { cellWidth: 16 },
        6: { cellWidth: 25, overflow: 'linebreak', fontSize: 8, minCellHeight: 11 },
        7: { cellWidth: 30 },
        8: { cellWidth: 16 },
      },
      alternateRowStyles: {
        fillColor: [245, 255, 245],
      },
      theme: 'plain',
    });

    // Получаем нижнюю позицию предыдущей таблицы.
    const finalY = (doc as any).lastAutoTable.finalY || startY;

    // Добавление контента сразу после таблицы.
    startY = finalY + 15; // Отступ от последней таблицы.
  });

  // Сохранение PDF
  doc.save('registered-riders.pdf');
};
