'use client';
import React from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { FaWalking, FaExternalLinkAlt, FaDirections } from 'react-icons/fa';
import { NearbyPlace } from '@/app/types/map';

interface NearbyPlacePopupProps {
  place: NearbyPlace;
  onClose: () => void;
  onViewDetails: () => void;
}

const NearbyPlacePopup: React.FC<NearbyPlacePopupProps> = ({
  place,
  onClose,
  onViewDetails,
}) => {
  const distanceInKm = (parseFloat(place.distance_in_meters) / 1000).toFixed(2);

  return (
    <Popup
      longitude={parseFloat(place.longitude)}
      latitude={parseFloat(place.latitude)}
      anchor='bottom'
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      className='nearby-place-popup'
      maxWidth='300px'
    >
      <div className='p-2.5 max-w-xs'>
        <h3 className='font-medium text-gray-800 text-sm mb-1.5'>
          {place.name}
        </h3>
        <div className='flex items-center gap-1.5 mb-2'>
          <span className='text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium'>
            {place.pType}
          </span>
          <span className='text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded-full'>
            {place.subType}
          </span>
        </div>
        <p className='text-xs text-gray-600 mb-2 line-clamp-2'>
          {place.Address}
        </p>
        <div className='flex items-center text-xs text-gray-600 mb-2'>
          <FaWalking className='mr-1 text-gray-400' size={12} />
          <span>{distanceInKm} km away</span>
        </div>
        <div className='flex justify-between mt-2'>
          <button
            onClick={onViewDetails}
            className='text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center'
          >
            <FaExternalLinkAlt className='mr-1' size={10} />
            View Details
          </button>
          <button className='text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center'>
            <FaDirections className='mr-1' size={10} />
            Directions
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default NearbyPlacePopup;
