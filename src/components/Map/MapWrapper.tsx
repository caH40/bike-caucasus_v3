// components/MapWrapper.client.tsx
'use client';

import dynamic from 'next/dynamic';

const MapWithElevationDynamic = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div>Загрузка карты...</div>,
});

export default function MapWrapper({ url, laps = 1 }: { url: string; laps?: number }) {
  // FIXME: Для исключения двойного рейдинга MapContainer в следствии чего возникает ошибка в srict mode, отключил рендеренг данного компонента в dev режиме
  // return <MapWithElevationDynamic url={url} laps={laps} />;
  return process.env.NODE_ENV !== 'development' ? (
    <MapWithElevationDynamic url={url} laps={laps} />
  ) : null;
}
