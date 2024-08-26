import { ElevationData } from '@/types/index.interface';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

/**
 * Настройки и данные для построения Диаграммы профиля высоты маршрута.
 *
 * @param {ElevationData[]} elevationData - Массив данных высоты и дистанции.
 * @returns {{ chartData: ChartData<'line'>, chartOptions: ChartOptions<'line'> }}
 * Объект, содержащий данные и настройки для диаграммы профиля высоты.
 */
export function chartAltitude(elevationData: ElevationData[]): {
  chartData: ChartData<'line'>;
  chartOptions: ChartOptions<'line'>;
} {
  // Данные для диаграммы
  const chartData: ChartData<'line'> = {
    labels: elevationData.map((data) => data.distance.toString()), // Метки по оси X (дистанция).
    datasets: [
      {
        label: 'Профиль высоты',
        data: elevationData.map((data) => data.elevation), // Значения по оси Y (высота).
        borderColor: '#ffffff',
        backgroundColor: '#ffffff20',
        fill: true,
        borderWidth: 1,
        pointBackgroundColor: 'rgba(0, 0, 0, 0)', // Прозрачные точки.
        pointBorderColor: 'rgba(0, 0, 0, 0)', // Прозрачная граница точек.
      },
    ],
  };

  // Настройки для диаграммы
  const chartOptions: ChartOptions<'line'> = {
    color: '#ffffff80',
    responsive: true,
    maintainAspectRatio: false, // Отключение сохранения пропорций.
    animation: false, // Отключение анимации.
    scales: {
      x: {
        title: {
          color: '#ffffff80',
          display: false,
          text: 'Дистанция (km)',
        },
        ticks: {
          color: '#ffffff80',
          stepSize: 50,
        },
      },
      y: {
        title: {
          color: '#ffffff80',
          display: false,
          text: 'Высота (m)',
        },
        ticks: {
          color: '#ffffff80',
        },
        // beginAtZero: true, // Начало оси Y с нуля.
      },
    },

    plugins: {
      tooltip: {
        enabled: true, // Включение всплывающих подсказок.
        mode: 'index',
        intersect: false,
        callbacks: {
          // Размерность в подсказке для оси Y.
          label: function (tooltipItem) {
            if (typeof tooltipItem.raw === 'number') {
              const value = Math.trunc(tooltipItem.raw);
              return `${value} м`;
            } else {
              ('н/д');
            }
          },
        },
      },
      crosshair: {
        line: {
          color: '#F66', // Цвет линии crosshair.
          width: 1, // Ширина линии crosshair.
        },
        sync: {
          enabled: true, // Включение синхронизации trace line с другими диаграммами.
          group: 1, // Группа диаграмм для синхронизации.
          suppressTooltips: false, // Отключение всплывающих подсказок при показе синхронизированного трейса.
        },
        zoom: {
          enabled: false, // Отключение зума
          zoomboxBackgroundColor: 'rgba(66,133,244,0.2)', // Цвет фона зум-бокса.
          zoomboxBorderColor: '#48F', // Цвет границы зум-бокса.
          zoomButtonText: 'Reset Zoom', // Текст кнопки сброса зума.
          zoomButtonClass: 'reset-zoom', // Класс кнопки сброса зума.
        },
        // callbacks: {
        //   beforeZoom: () =>
        //     function (start, end) {
        //       // called before zoom, return false to prevent zoom
        //       return true;
        //     },
        //   afterZoom: () =>
        //     function (start, end) {
        //       // called after zoom
        //     },
        // },
      },
    },
  };

  return { chartData, chartOptions };
}

// Расширение типов Chart.js для поддержки crosshair плагина.
declare module 'chart.js' {
  // eslint-disable-next-line no-unused-vars
  interface PluginOptionsByType<TType extends ChartType> {
    crosshair?: {
      line?: {
        color?: string;
        width?: number;
      };
      sync?: {
        enabled?: boolean;
        group?: number | string;
        suppressTooltips?: boolean;
      };
      zoom?: {
        enabled?: boolean;
        zoomboxBackgroundColor?: string;
        zoomboxBorderColor?: string;
        zoomButtonText?: string;
        zoomButtonClass?: string;
      };
      callbacks?: {
        // eslint-disable-next-line no-unused-vars
        beforeZoom?: (start: number, end: number) => boolean;
        // eslint-disable-next-line no-unused-vars
        afterZoom?: (start: number, end: number) => void;
      };
    };
  }
}
