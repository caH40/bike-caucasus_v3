import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

import '../fonts/base64/roboto-bold';
import '../fonts/base64/roboto-regular';

type jsPDFCustom = jsPDF & {
  // eslint-disable-next-line no-unused-vars
  autoTable: (options: UserOptions) => void;
};

type Params = {
  subTitles: string[];
};

/**
 *  Скачивание PDF файла таблицы бланка протокола с участниками для фиксации результатов.
 */
export const getPdfBlankForProtocol = ({ subTitles }: Params) => {
  const doc = new jsPDF() as jsPDFCustom;

  // Установка шрифта для заголовка
  doc.setFont('Roboto-Bold', 'normal');
  doc.setFontSize(18);
  doc.text('Протокол соревнований', 14, 16);

  doc.setFont('Roboto-Regular', 'normal');
  doc.setFontSize(15);
  // Отрисовка строк из массива, высота строки 8мм.
  let startY = 24;
  subTitles.forEach((elm) => {
    doc.text(elm, 14, startY);
    startY += 7;
  });

  // Создание названий колонок для таблицы.
  const current = [
    { index: 1, header: '#' },
    { index: 2, header: 'Номер' },
    { index: 3, header: 'Участник' },
    { index: 4, header: 'Финишное время' },
    { index: 5, header: 'Комментарии' },
  ];

  // Формируем заголовки таблицы
  const headers = current.map((col: { index: number; header: string }) => col.header || '');

  // Формируем данные для таблицы
  const quantityRowEmpty = 100;
  const body = Array(quantityRowEmpty)
    .fill('')
    .map((_, indexRow) =>
      current.map((_, indexColumn) => (indexColumn === 0 ? indexRow + 1 : ''))
    );

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
      0: { cellWidth: 10, minCellHeight: 10 },
      1: { cellWidth: 20 },
      2: { cellWidth: 50 },
      3: { cellWidth: 35 },
      4: { cellWidth: 70 },
    },
    alternateRowStyles: {
      fillColor: [245, 255, 245], // Светло-синий цвет для чередующихся строк
    },
    theme: 'plain', // Использование сетки для отображения границ
  });

  // Сохранение PDF
  doc.save('protocol-blank.pdf');
};
