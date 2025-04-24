// components/MapWrapper.client.tsx
'use client';

import dynamic from 'next/dynamic';

const MapWithElevationDynamic = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div>Загрузка карты...</div>,
});

export default function MapWrapper({ url }: { url: string }) {
  return <MapWithElevationDynamic url={url} />;
}
