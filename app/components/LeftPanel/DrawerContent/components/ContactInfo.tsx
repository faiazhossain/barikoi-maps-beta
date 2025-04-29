// components/ContactInfo.tsx
import React from 'react';
import { FaPhone, FaEnvelope, FaGlobe, FaInfoCircle } from 'react-icons/fa';

interface ContactInfoProps {
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

export const ContactInfo = ({ phone, email, website }: ContactInfoProps) => (
  <div className='space-y-3 py-4 border-b border-gray-200'>
    <h3 className='flex items-center gap-2 font-medium text-gray-700'>
      <FaInfoCircle className='text-blue-500' />
      Contact Information
    </h3>

    {phone && (
      <div className='flex items-center gap-3 text-sm'>
        <FaPhone className='text-gray-400' />
        <a href={`tel:${phone}`} className='text-blue-600 hover:underline'>
          {phone}
        </a>
      </div>
    )}

    {email && (
      <div className='flex items-center gap-3 text-sm'>
        <FaEnvelope className='text-gray-400' />
        <a href={`mailto:${email}`} className='text-blue-600 hover:underline'>
          {email}
        </a>
      </div>
    )}

    {website && (
      <div className='flex items-center gap-3 text-sm'>
        <FaGlobe className='text-gray-400' />
        <a
          href={website}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:underline'
        >
          {website}
        </a>
      </div>
    )}
  </div>
);
