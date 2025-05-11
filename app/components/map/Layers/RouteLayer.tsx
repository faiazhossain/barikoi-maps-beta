'use client';

import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import { useAppSelector } from '@/app/store/store';

const ROUTE_LAYER_ID = 'route-layer';
const ROUTE_SOURCE_ID = 'route-source';
const ROUTE_OUTLINE_ID = 'route-outline'; // Added an outline layer ID

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
      <Source
        id={ROUTE_SOURCE_ID}
        type='geojson'
        data={routeData}
        lineMetrics={true}
      >
        {/* Route outline - renders under the main route for a nice border effect */}
        <Layer
          id={ROUTE_OUTLINE_ID}
          type='line'
          paint={{
            'line-color': '#30c5ff', // White outline
            'line-width': 9, // Slightly wider than the main route
            'line-opacity': 1,
            'line-blur': 0.5,
          }}
        />
        {/* Main route line with improved styling */}
        <Layer
          id={ROUTE_LAYER_ID}
          type='line'
          paint={{
            'line-color': '#2563EB', // More vibrant blue
            'line-width': 6,
            'line-blur': 0.5, // Slight blur for a smoother look
            'line-opacity': 0.8,
          }}
        />
      </Source>
    </>
  );
};

export default RouteLayer;
