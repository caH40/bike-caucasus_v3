import { RefObject, useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js';
import { getRelativePosition } from 'chart.js/helpers';
import type { ElevationData } from '@/types/index.interface';

type Props = {
  refChartLine: RefObject<ChartJS<'line'>>;
  elevationData: ElevationData[];
};

/**
 * Пользовательский хук, который вычисляет индекс данных высоты на основе позиции курсора на графике.
 * @param {Props} props - Свойства для хука.
 * @param {RefObject<ChartJS<'line'>>} props.refChartLine - Ссылка на линейный график Chart.js.
 * @param {ElevationData[]} props.elevationData - Массив данных высоты.
 * @returns {number} Индекс данных высоты, соответствующий позиции курсора на графике.
 */
export default function usePositionIndex({ refChartLine, elevationData }: Props): number {
  const [positionIndex, setPositionIndex] = useState<number>(100);
  useEffect(() => {
    // Получаем экземпляр графика из ссылки.
    const chart: any = refChartLine.current;

    // Если экземпляр графика недоступен, выходим.
    if (!chart) {
      return;
    }

    // Получаем элемент canvas из графика.
    const canvas = chart.canvas;

    /**
     * Обработчик событий для перемещения мыши по canvas.
     *
     * @param {MouseEvent} event - Событие мыши.
     */
    const handleMove = (event: MouseEvent) => {
      // Получаем относительное положение курсора на canvas.
      const canvasPosition = getRelativePosition(event, chart);
      // Получаем значение по оси X для позиции курсора
      // (значение индекса позиции, первая точка = 0 index, вторая = 1 index и т.д.).
      const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
      // Установка индекса массива в котором расположены соответствующие данные позиции на треке,
      // которые выбраны на графике Профиль высоты.
      if (elevationData[dataX]) {
        setPositionIndex(dataX);
      }
    };

    canvas.addEventListener('mousemove', handleMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMove);
    };
  }, [elevationData, refChartLine]);

  return positionIndex;
}
