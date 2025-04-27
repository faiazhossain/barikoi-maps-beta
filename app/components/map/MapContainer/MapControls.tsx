import React from 'react';
import {
  AttributionControl,
  NavigationControl,
  GeolocateControl,
} from 'react-map-gl/maplibre';

const MapControls: React.FC = () => {
  return (
    <>
      {window.screen.width > 640 ? (
        <>
          <AttributionControl position="bottom-right" compact={true} />
          <NavigationControl position="bottom-right" />
        </>
      ) : (
        <></>
      )}
      <GeolocateControl position="bottom-right" />
    </>
  );
};

export default MapControls;
