// components/AdditionalInfo.tsx
import React from 'react';
import { FaInfoCircle, FaMapMarkedAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface AdditionalInfoProps {
  district: string;
  thana: string;
  area: string;
  subArea: string;
}

const infoItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const AdditionalInfo = ({
  district,
  thana,
  area,
  subArea,
}: AdditionalInfoProps) => (
  <motion.div
    initial='hidden'
    animate='visible'
    transition={{ staggerChildren: 0.1 }}
    className='p-4 bg-white rounded-lg shadow-sm border border-gray-100'
  >
    <motion.h3
      variants={infoItem}
      className='flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4'
    >
      <FaInfoCircle className='text-green-500 text-xl' />
      Location Details
    </motion.h3>

    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      <motion.div
        variants={infoItem}
        className='p-3 bg-gray-50 rounded-lg  transition-colors'
      >
        <div className='flex items-center gap-2 text-gray-500 mb-1'>
          <FaMapMarkedAlt className='text-green-400' />
          <span className='text-sm font-medium'>District</span>
        </div>
        <p className='text-gray-800 font-medium'>{district}</p>
      </motion.div>

      <motion.div
        variants={infoItem}
        className='p-3 bg-gray-50 rounded-lg  transition-colors'
      >
        <div className='flex items-center gap-2 text-gray-500 mb-1'>
          <FaMapMarkedAlt className='text-green-400' />
          <span className='text-sm font-medium'>Thana</span>
        </div>
        <p className='text-gray-800 font-medium'>{thana}</p>
      </motion.div>

      <motion.div
        variants={infoItem}
        className='p-3 bg-gray-50 rounded-lg  transition-colors'
      >
        <div className='flex items-center gap-2 text-gray-500 mb-1'>
          <FaMapMarkedAlt className='text-green-400' />
          <span className='text-sm font-medium'>Area</span>
        </div>
        <p className='text-gray-800 font-medium'>{area}</p>
      </motion.div>

      <motion.div
        variants={infoItem}
        className='p-3 bg-gray-50 rounded-lg  transition-colors'
      >
        <div className='flex items-center gap-2 text-gray-500 mb-1'>
          <FaMapMarkedAlt className='text-green-400' />
          <span className='text-sm font-medium'>Sub Area</span>
        </div>
        <p className='text-gray-800 font-medium'>{subArea}</p>
      </motion.div>
    </div>
  </motion.div>
);
