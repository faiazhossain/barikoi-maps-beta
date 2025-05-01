// components/ContactInfo.tsx
import React from 'react';
import { FaPhone, FaEnvelope, FaGlobe, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ContactInfoProps {
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const ContactInfo = ({ phone, email, website }: ContactInfoProps) => (
  <motion.div
    initial='hidden'
    animate='visible'
    className='space-y-4 py-6 px-4 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm'
  >
    <motion.h3
      variants={itemVariants}
      className='flex items-center gap-3 text-lg font-semibold text-gray-800'
    >
      <FaInfoCircle className='text-blue-500 text-xl' />
      Contact Information
    </motion.h3>

    <div className='space-y-3 '>
      {phone && (
        <motion.div
          variants={itemVariants}
          className='flex items-center gap-3 text-sm group'
        >
          <div className='p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors'>
            <FaPhone className='text-blue-500' />
          </div>
          <a
            href={`tel:${phone}`}
            className='text-blue-600 hover:text-blue-700 hover:underline transition-colors'
          >
            {phone}
          </a>
        </motion.div>
      )}

      {email && (
        <motion.div
          variants={itemVariants}
          className='flex items-center gap-3 text-sm group'
        >
          <div className='p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors'>
            <FaEnvelope className='text-blue-500' />
          </div>
          <a
            href={`mailto:${email}`}
            className='text-blue-600 hover:text-blue-700 hover:underline transition-colors'
          >
            {email}
          </a>
        </motion.div>
      )}

      {website && (
        <motion.div
          variants={itemVariants}
          className='flex items-center gap-3 text-sm group'
        >
          <div className='p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors'>
            <FaGlobe className='text-blue-500' />
          </div>
          <a
            href={website}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-700 hover:underline transition-colors truncate max-w-[200px]'
          >
            {website.replace(/^https?:\/\//, '')}
          </a>
        </motion.div>
      )}
    </div>
  </motion.div>
);
