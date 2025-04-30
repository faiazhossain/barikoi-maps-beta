// components/PlaceHeader.tsx

import React from 'react';

interface PlaceHeaderProps {
  name: string;
  type: string;

  subType?: string;
}
export const PlaceHeader = ({ name, type, subType }: PlaceHeaderProps) => (
  <div className='py-2'>
    <h1 className='text-2xl font-bold text-gray-800 select-text'>{name}</h1>
    <div className='flex items-center gap-2 py-2 text-sm'>
      <span className='bg-blue-100 text-gray-600 px-3 py-1 rounded-full'>
        {type}
      </span>
      {subType && (
        <span className='bg-green-100 text-gray-500 px-3 py-1 rounded-full'>
          {subType}
        </span>
      )}
    </div>
  </div>
);
