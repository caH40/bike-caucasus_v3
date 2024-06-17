import { LayersControl, TileLayer } from 'react-leaflet';

const mapViewFormatObj = {
  OpenStreetMapMapnik: {
    formatName: 'OpenStreetMapMapnik',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  },
  OpenTopoMap: {
    formatName: 'OpenTopoMap',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
  EsriWorldTopoMap: {
    formatName: 'EsriWorldTopoMap',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, and the GIS User Community',
  },
};

/**
 * Выбор карты.
 */
export default function LayerControlBtn() {
  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="OpenStreetMap">
        <TileLayer
          attribution={mapViewFormatObj.OpenStreetMapMapnik.attribution}
          url={mapViewFormatObj.OpenStreetMapMapnik.url}
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="EsriWorldTopoMap">
        <TileLayer
          attribution={mapViewFormatObj.EsriWorldTopoMap.attribution}
          url={mapViewFormatObj.EsriWorldTopoMap.url}
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="OpenTopoMap">
        <TileLayer
          attribution={mapViewFormatObj.OpenTopoMap.attribution}
          url={mapViewFormatObj.OpenTopoMap.url}
        />
      </LayersControl.BaseLayer>
    </LayersControl>
  );
}
