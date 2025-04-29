// components/PlaceHeader.tsx
import React from 'react';

interface PlaceHeaderProps {
  name: string;
  type: string;
  subType?: string;
}

export const PlaceHeader = ({ name, type, subType }: PlaceHeaderProps) => (
  <div className='space-y-1'>
    <h1 className='text-2xl font-bold text-gray-800'>{name}</h1>
    <div className='flex items-center gap-2 text-sm text-gray-500'>
      <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
        {type}
      </span>
      {subType && (
        <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full'>
          {subType}
        </span>
      )}
    </div>
  </div>
);
