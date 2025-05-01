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
import { useAppSelector } from '@/app/store/store';
import MapLoader from '../../common/LoadingPage/MapLoader';
import ResponsiveDrawer from '../../LeftPanel/ResponsiveDrawer';

const MapContainer: React.FC = () => {
  const mapRef = useMapRef();
  const dispatch = useDispatch();
  const isLoading = useAppSelector((state) => state.search.placeDetailsLoading);
  const handleMapLoad = () => {
    dispatch(setMapLoaded(true)); // Dispatch map loaded state
  };
  const { isLeftBarOpen } = useAppSelector((state) => state.drawer);
  return (
    <Map
      ref={mapRef}
      mapLib={maplibregl}
      initialViewState={{
        longitude: 90.3938,
        latitude: 23.8103,
        zoom: 12,
      }}
      style={{ width: '100vw', height: '100dvh' }}
      mapStyle='/map-styles/light-style.json' // Local style.json
      attributionControl={false}
      onLoad={handleMapLoad} // Trigger when the map is fully loaded
    >
      <MapControls />
      <BarikoiAttribution />
      {/* {isLeftBarOpen && <LeftDrawer />} */}
      {isLeftBarOpen && <ResponsiveDrawer />}
      {isLoading && <MapLoader />}
    </Map>
  );
};

export default MapContainer;
