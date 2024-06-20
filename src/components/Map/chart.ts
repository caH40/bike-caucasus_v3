import { ElevationData } from '@/types/index.interface';
import { ChartData, ChartOptions } from 'chart.js';

/**
 * Настройки и данные для построения Диаграммы профиля высоты маршрута.
 */
export function chartAltitude(elevationData: ElevationData[]) {
  const chartData: ChartData<'line'> = {
    labels: elevationData.map((data) => data.distance.toString()),
    datasets: [
      {
        label: 'Профиль высоты',
        data: elevationData.map((data) => data.elevation),
        borderColor: '#ffffff',
        backgroundColor: '#ffffff20',
        fill: true,
        borderWidth: 1,
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    color: '#ffffff80',
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
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
          // mirror: true, // Отражение подписей от оси
        },

        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
        mode: 'index',
        intersect: false,
      },
    },
  };

  return { chartData, chartOptions };
}
