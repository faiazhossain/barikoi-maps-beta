'use client';
import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map from 'react-map-gl/maplibre';
import useMapRef from '../hooks/useMapRef';
import MapControls from './MapControls';
import BarikoiAttribution from './BarikoiAttribution';
import { useDispatch } from 'react-redux';
import { setMapLoaded } from '@/app/store/slices/mapSlice';

const MapContainer: React.FC = () => {
  const mapRef = useMapRef();
  const dispatch = useDispatch();

  const handleMapLoad = () => {
    dispatch(setMapLoaded(true)); // Dispatch map loaded state
  };

  return (
    <div className="w-screen h-screen relative">
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          longitude: 90.3938,
          latitude: 23.8103,
          zoom: 12,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="/map-styles/light-style.json" // Local style.json
        attributionControl={false}
        onLoad={handleMapLoad} // Trigger when the map is fully loaded
      >
        <MapControls />
        <BarikoiAttribution />
      </Map>
    </div>
  );
};

export default MapContainer;
