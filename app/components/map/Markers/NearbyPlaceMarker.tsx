'use client';
import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import {
  FaUtensils,
  FaHotel,
  FaHospital,
  FaSchool,
  FaStore,
  FaUniversity,
  FaBriefcase,
  FaQuestion,
} from 'react-icons/fa';
import { NearbyPlace } from '@/app/types/map';

interface NearbyPlaceMarkerProps {
  place: NearbyPlace;
  onClick: (place: NearbyPlace) => void;
}

/**
 * Get the appropriate icon based on place type
 */
const getPlaceIcon = (pType: string) => {
  switch (pType.toLowerCase()) {
    case 'food':
      return <FaUtensils className='h-3.5 w-3.5' />;
    case 'hotel':
      return <FaHotel className='h-3.5 w-3.5' />;
    case 'health':
    case 'hospital':
      return <FaHospital className='h-3.5 w-3.5' />;
    case 'education':
    case 'school':
      return <FaSchool className='h-3.5 w-3.5' />;
    case 'shopping':
    case 'shop':
      return <FaStore className='h-3.5 w-3.5' />;
    case 'university':
    case 'college':
      return <FaUniversity className='h-3.5 w-3.5' />;
    case 'business':
    case 'office':
      return <FaBriefcase className='h-3.5 w-3.5' />;
    default:
      return <FaQuestion className='h-3.5 w-3.5' />;
  }
};

/**
 * Get marker color based on place type
 */
const getMarkerColor = (pType: string): string => {
  switch (pType.toLowerCase()) {
    case 'food':
      return 'bg-orange-500';
    case 'hotel':
      return 'bg-blue-600';
    case 'health':
    case 'hospital':
      return 'bg-red-500';
    case 'education':
    case 'school':
    case 'university':
    case 'college':
      return 'bg-green-600';
    case 'shopping':
    case 'shop':
      return 'bg-purple-600';
    case 'business':
    case 'office':
      return 'bg-slate-600';
    default:
      return 'bg-blue-500';
  }
};

const NearbyPlaceMarker: React.FC<NearbyPlaceMarkerProps> = ({
  place,
  onClick,
}) => {
  return (
    <Marker
      longitude={parseFloat(place.longitude)}
      latitude={parseFloat(place.latitude)}
      anchor='top'
      onClick={() => onClick(place)}
    >
      <div className='cursor-pointer transform transition-transform hover:scale-110'>
        <div className='flex flex-col items-center'>
          <div
            className={`w-8 h-8 rounded-full ${getMarkerColor(
              place.pType
            )} flex items-center justify-center text-white shadow-md border-2 border-white`}
          >
            {getPlaceIcon(place.pType)}
          </div>
        </div>
      </div>
    </Marker>
  );
};

export default NearbyPlaceMarker;
