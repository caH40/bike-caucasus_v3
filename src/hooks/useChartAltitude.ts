import { useMemo } from 'react';
import { ElevationData } from '@/types/index.interface';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

export function useChartAltitude(elevationData: ElevationData[]): {
  chartData: ChartData<'line'>;
  chartOptions: ChartOptions<'line'>;
} {
  return useMemo(() => {
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
          },
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (tooltipItem) {
              if (typeof tooltipItem.raw === 'number') {
                const value = Math.trunc(tooltipItem.raw);
                return `${value} м`;
              }
              return 'н/д';
            },
          },
        },
        crosshair: {
          line: { color: '#F66', width: 1 },
          sync: { enabled: true, group: 1, suppressTooltips: false },
          zoom: {
            enabled: false,
            zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',
            zoomboxBorderColor: '#48F',
            zoomButtonText: 'Reset Zoom',
            zoomButtonClass: 'reset-zoom',
          },
        },
      },
    };

    return { chartData, chartOptions };
  }, [elevationData]);
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
