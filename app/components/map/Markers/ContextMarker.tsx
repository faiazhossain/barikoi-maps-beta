import React from 'react';
import { Marker } from 'react-map-gl/maplibre';

interface ContextMarkerProps {
  longitude: number;
  latitude: number;
}

const ContextMarker: React.FC<ContextMarkerProps> = ({
  longitude,
  latitude,
}) => {
  return (
    <Marker longitude={longitude} latitude={latitude} anchor='center'>
      <div className='w-4 h-4 rounded-full bg-blue-500 pulse-animation' />
    </Marker>
  );
};

export default ContextMarker;
