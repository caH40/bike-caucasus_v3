import { ElevationData } from '@/types/index.interface';
import { ChartData, ChartOptions } from 'chart.js';

/**
 * Настройки и данные для построения Диаграммы профиля высоты маршрута.
 */
export function chartAltitude(elevationData: ElevationData[]) {
  // попытка убрать дубли ()
  // const dataSet = new Map();
  // elevationData.forEach((elm) => dataSet.set(elm.distance, elm));
  // const value = [...dataSet.values()];

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
      crosshair: {
        line: {
          color: '#F66', // crosshair line color
          width: 1, // crosshair line width
        },
        sync: {
          enabled: true, // enable trace line syncing with other charts
          group: 1, // chart group
          suppressTooltips: false, // suppress tooltips when showing a synced tracer
        },
        zoom: {
          enabled: true, // enable zooming
          zoomboxBackgroundColor: 'rgba(66,133,244,0.2)', // background color of zoom box
          zoomboxBorderColor: '#48F', // border color of zoom box
          zoomButtonText: 'Reset Zoom', // reset zoom button text
          zoomButtonClass: 'reset-zoom', // reset zoom button class
        },
        callbacks: {
          beforeZoom: () =>
            function (start, end) {
              // called before zoom, return false to prevent zoom
              return true;
            },
          afterZoom: () =>
            function (start, end) {
              // called after zoom
            },
        },
      },
    },
  };

  return { chartData, chartOptions };
}
