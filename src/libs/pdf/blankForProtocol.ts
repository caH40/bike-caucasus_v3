import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import '../fonts/base64/roboto-bold';
import '../fonts/base64/roboto-regular';

type Params = {
  subTitles: string[];
};

/**
 * Скачивание PDF файла таблицы бланка протокола с участниками для фиксации результатов.
 */
export const getPdfBlankForProtocol = ({ subTitles }: Params) => {
  const doc = new jsPDF();

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
  const headers = current.map((col) => col.header);

  // Формируем данные для таблицы
  const quantityRowEmpty = 100;
  const body = Array(quantityRowEmpty)
    .fill('')
    .map((_, indexRow) =>
      current.map((_, indexColumn) => (indexColumn === 0 ? (indexRow + 1).toString() : ''))
    );

  // Добавляем таблицу в PDF
  autoTable(doc, {
    head: [headers],
    body: body,
    startY: startY, // Стартовая позиция по Y для таблицы.
    styles: {
      font: 'Roboto-Regular',
      fontStyle: 'normal',
      fontSize: 10,
      lineColor: [150, 150, 150],
      lineWidth: 0.05,
      textColor: [0, 0, 0],
    },
    headStyles: {
      font: 'Roboto-Bold',
      fontStyle: 'normal',
      fillColor: [49, 141, 44],
      textColor: [0, 0, 0],
    },
    bodyStyles: {
      font: 'Roboto-Regular',
      fontStyle: 'normal',
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 10, minCellHeight: 10 },
      1: { cellWidth: 20 },
      2: { cellWidth: 50 },
      3: { cellWidth: 35 },
      4: { cellWidth: 70 },
    },
    alternateRowStyles: {
      fillColor: [245, 255, 245], // Светло-зеленый цвет для чередующихся строк
    },
    theme: 'grid', // Использование сетки для отображения границ
  });

  // Сохранение PDF
  doc.save('protocol-blank.pdf');
};
