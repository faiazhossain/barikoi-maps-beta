'use client';

import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import { useAppSelector } from '@/app/store/store';

const ROUTE_LAYER_ID = 'route-layer';
const ROUTE_SOURCE_ID = 'route-source';

const RouteLayer: React.FC = () => {
  const { route } = useAppSelector((state) => state.directions);
  const [routeData, setRouteData] = useState<any>(null);

  useEffect(() => {
    if (route && route.points && route.points.coordinates.length > 0) {
      // Create GeoJSON feature collection with the route line
      setRouteData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              distance: route.distance,
              time: route.time,
            },
            geometry: {
              type: 'LineString',
              coordinates: route.points.coordinates,
            },
          },
        ],
      });
    } else {
      setRouteData(null);
    }
  }, [route]);

  if (!routeData) return null;

  return (
    <>
      <Source id={ROUTE_SOURCE_ID} type='geojson' data={routeData}>
        <Layer
          id={ROUTE_LAYER_ID}
          type='line'
          paint={{
            'line-color': '#0066FF',
            'line-width': 5,
            'line-opacity': 0.8,
          }}
        />
      </Source>

      {/* Add markers for origin and destination points if needed */}
    </>
  );
};

export default RouteLayer;
