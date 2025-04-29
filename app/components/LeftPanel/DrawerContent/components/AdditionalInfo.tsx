// components/AdditionalInfo.tsx
import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface AdditionalInfoProps {
  district: string;
  thana: string;
  area: string;
  subArea: string;
}

export const AdditionalInfo = ({
  district,
  thana,
  area,
  subArea,
}: AdditionalInfoProps) => (
  <div className='space-y-3 py-4'>
    <h3 className='flex items-center gap-2 font-medium text-gray-700'>
      <FaInfoCircle className='text-green-500' />
      Additional Information
    </h3>

    <div className='grid grid-cols-2 gap-3 text-sm'>
      <div>
        <p className='text-gray-500'>District</p>
        <p className='text-gray-800'>{district}</p>
      </div>
      <div>
        <p className='text-gray-500'>Thana</p>
        <p className='text-gray-800'>{thana}</p>
      </div>
      <div>
        <p className='text-gray-500'>Area</p>
        <p className='text-gray-800'>{area}</p>
      </div>
      <div>
        <p className='text-gray-500'>Sub Area</p>
        <p className='text-gray-800'>{subArea}</p>
      </div>
    </div>
  </div>
);
