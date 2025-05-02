'use client';
import React, { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapGL, { MapRef } from 'react-map-gl/maplibre';
import { useMapRef } from '../hooks/useMapRef';
import { useRouteFromUrl } from '../hooks/useRouteFromUrl';
import MapControls from './MapControls';
import BarikoiAttribution from './BarikoiAttribution';
import { useDispatch } from 'react-redux';
import { setMapLoaded } from '@/app/store/slices/mapSlice';
import { useAppSelector } from '@/app/store/store';
import ResponsiveDrawer from '../../LeftPanel/ResponsiveDrawer';
import { useUrlParams } from '@/app/hooks/useUrlParams';
import AnimatedMarker from '../Markers/AnimatedMarker';

const MapContainer: React.FC = () => {
  const mapRef = useMapRef();
  const dispatch = useDispatch();
  const { isLeftBarOpen } = useAppSelector((state) => state.drawer);
  const { placeDetails } = useAppSelector((state) => state.search);
  // Add state for marker coordinates
  const [markerCoords, setMarkerCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Add URL params hook
  useUrlParams();

  // Use the route hook with proper typing
  useRouteFromUrl(mapRef as React.RefObject<MapRef>);

  // Handle coordinate changes
  useEffect(() => {
    if (placeDetails) {
      const latitude = placeDetails.latitude;
      const longitude = placeDetails.longitude;

      if (!isNaN(latitude) && !isNaN(longitude)) {
        setMarkerCoords({ latitude, longitude });

        // Fly to location
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 16,
          duration: 2000,
          essential: true,
        });
      }
    }
  }, [placeDetails]);

  const handleMapLoad = () => {
    dispatch(setMapLoaded(true));
  };

  return (
    <MapGL
      ref={mapRef as unknown as React.RefObject<MapRef>}
      mapLib={maplibregl}
      initialViewState={{
        longitude: 90.3938,
        latitude: 23.8103,
        zoom: 12,
      }}
      style={{ width: '100vw', height: '100dvh' }}
      mapStyle='/map-styles/light-style.json'
      attributionControl={false}
      onLoad={handleMapLoad}
      hash={true}
    >
      <MapControls />
      <BarikoiAttribution />
      {isLeftBarOpen && <ResponsiveDrawer />}

      {/* Add the animated marker */}
      {markerCoords && (
        <AnimatedMarker
          latitude={markerCoords.latitude}
          longitude={markerCoords.longitude}
        />
      )}
    </MapGL>
  );
};

export default MapContainer;
