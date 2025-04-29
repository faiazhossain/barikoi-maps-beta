// components/AddressSection.tsx
import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface AddressSectionProps {
  holdingNumber: string;
  roadNameNumber: string;
  area: string;
  city: string;
  postcode: string;
}

export const AddressSection = ({
  holdingNumber,
  roadNameNumber,
  area,
  city,
  postcode,
}: AddressSectionProps) => (
  <div className='space-y-3 py-4 border-b border-gray-200'>
    <h3 className='flex items-center gap-2 font-medium text-gray-700'>
      <FaMapMarkerAlt className='text-red-500' />
      Address
    </h3>

    <div className='space-y-1 text-sm text-gray-600'>
      <p>
        {holdingNumber}, {roadNameNumber}
      </p>
      <p>
        {area}, {city}
      </p>
      <p>Postcode: {postcode}</p>
    </div>
  </div>
);
