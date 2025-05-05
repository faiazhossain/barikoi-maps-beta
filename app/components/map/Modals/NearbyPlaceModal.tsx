'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaDirections, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { NearbyPlace } from '@/app/types/map';

interface NearbyPlaceModalProps {
  place: NearbyPlace;
  onClose: () => void;
}

const NearbyPlaceModal: React.FC<NearbyPlaceModalProps> = ({
  place,
  onClose,
}) => {
  const distanceInKm = (parseFloat(place.distance_in_meters) / 1000).toFixed(2);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className='bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto'
      >
        <div className='p-4'>
          <div className='flex justify-between items-start mb-4'>
            <h2 className='text-lg font-medium text-gray-800'>{place.name}</h2>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 transition-colors'
              aria-label='Close modal'
            >
              <FaTimes />
            </button>
          </div>

          <div className='flex flex-wrap gap-2 mb-4'>
            <span className='text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium'>
              {place.pType}
            </span>
            <span className='text-sm bg-gray-50 text-gray-600 px-2 py-1 rounded-full'>
              {place.subType}
            </span>
          </div>

          <div className='bg-gray-50 p-3 rounded-lg mb-4'>
            <div className='flex items-start mb-2'>
              <FaMapMarkerAlt className='text-blue-500 mt-1 mr-2 flex-shrink-0' />
              <div>
                <h3 className='text-sm font-medium text-gray-700 mb-1'>
                  Address
                </h3>
                <p className='text-sm text-gray-600'>{place.Address}</p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-2 text-sm mt-3'>
              <div className='bg-white p-2 rounded'>
                <span className='text-gray-500 block text-xs'>City</span>
                <span className='font-medium'>{place.city}</span>
              </div>
              <div className='bg-white p-2 rounded'>
                <span className='text-gray-500 block text-xs'>Area</span>
                <span className='font-medium'>{place.area}</span>
              </div>
              <div className='bg-white p-2 rounded'>
                <span className='text-gray-500 block text-xs'>Post Code</span>
                <span className='font-medium'>{place.postCode}</span>
              </div>
              <div className='bg-white p-2 rounded'>
                <span className='text-gray-500 block text-xs'>Distance</span>
                <span className='font-medium'>{distanceInKm} km</span>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 p-3 rounded-lg mb-4'>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>
              Location Details
            </h3>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='bg-white p-2 rounded'>
                <span className='text-gray-500 block text-xs'>Latitude</span>
                <span className='font-medium'>{place.latitude}</span>
              </div>
              <div className='bg-white p-2 rounded'>
                <span className='text-gray-500 block text-xs'>Longitude</span>
                <span className='font-medium'>{place.longitude}</span>
              </div>
              <div className='bg-white p-2 rounded col-span-2'>
                <span className='text-gray-500 block text-xs'>Unique Code</span>
                <span className='font-medium'>{place.uCode}</span>
              </div>
            </div>
          </div>

          <div className='flex justify-between mt-4'>
            <button className='bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center text-sm transition-colors'>
              <FaPhone className='mr-1.5' size={12} />
              Call
            </button>
            <button className='bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center text-sm transition-colors'>
              <FaDirections className='mr-1.5' size={12} />
              Get Directions
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NearbyPlaceModal;
