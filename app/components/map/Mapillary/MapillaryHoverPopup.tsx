import React from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { FaImage } from 'react-icons/fa';
import { MapillaryFeature, formatDate } from './MapillaryUtils';

interface MapillaryHoverPopupProps {
  feature: MapillaryFeature;
}

const MapillaryHoverPopup: React.FC<MapillaryHoverPopupProps> = ({
  feature,
}) => {
  return (
    <Popup
      longitude={feature.coordinates[0]}
      latitude={feature.coordinates[1]}
      closeButton={false}
      closeOnClick={false}
      className='mapillary-popup'
      offset={[0, -5]}
      anchor='bottom'
    >
      <div className='p-2 bg-white rounded shadow-md max-w-xs'>
        <div className='flex items-center mb-1.5 border-b pb-1.5 border-gray-100'>
          <FaImage className='text-green-600 mr-2' />
          <span className='font-medium text-sm'>Mapillary Image</span>
        </div>
        <div className='text-xs space-y-1.5'>
          <div className='flex justify-between'>
            <span className='text-gray-500'>Captured:</span>
            <span>{formatDate(feature.properties.captured_at)}</span>
          </div>
          {feature.properties.compass_angle && (
            <div className='flex justify-between'>
              <span className='text-gray-500'>Direction:</span>
              <span>{Math.round(feature.properties.compass_angle)}°</span>
            </div>
          )}
          <div className='mt-2'>
            <a
              href={`https://www.mapillary.com/app/?focus=photo&pKey=${feature.properties.id}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 inline-block w-full text-center mt-1'
            >
              View on Mapillary
            </a>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default MapillaryHoverPopup;
