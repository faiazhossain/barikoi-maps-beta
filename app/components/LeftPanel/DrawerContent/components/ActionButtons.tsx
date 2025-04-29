// components/ActionButtons.tsx
import React from 'react';
import { FaShareAlt, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { MdDirections } from 'react-icons/md';

export const ActionButtons = () => (
  <div className='flex justify-between py-3 border-b border-t border-gray-200'>
    <button className='flex flex-col items-center text-xs text-gray-600 hover:text-blue-600'>
      <FaShareAlt className='text-lg mb-1' />
      <span>Share</span>
    </button>
    <button className='flex flex-col items-center text-xs text-gray-600 hover:text-blue-600'>
      <MdDirections className='text-lg mb-1' />
      <span>Directions</span>
    </button>
    <button className='flex flex-col items-center text-xs text-gray-600 hover:text-blue-600'>
      <FaMapMarkerAlt className='text-lg mb-1' />
      <span>Nearby</span>
    </button>
    <button className='flex flex-col items-center text-xs text-gray-600 hover:text-blue-600'>
      <FaEdit className='text-lg mb-1' />
      <span>Suggest Edit</span>
    </button>
  </div>
);
