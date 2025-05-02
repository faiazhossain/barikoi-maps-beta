import React, { useState } from 'react';
import { FaCopy, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { BsMailbox2Flag } from 'react-icons/bs';
import { Tooltip } from 'antd';

interface AddressSectionProps {
  address: string;
  postcode: string;
  holdingNumber?: string;
  roadNameNumber?: string;
  area?: string;
  city?: string;
}

export const AddressSection = ({ address, postcode }: AddressSectionProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = () => {
    const fullAddress = `${address}, ${postcode}`;
    navigator.clipboard
      .writeText(fullAddress)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
      })
      .catch((err) => {
        console.error('Failed to copy address: ', err);
      });
  };

  return (
    <motion.div
      className='p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer relative rounded-lg'
      onClick={copyToClipboard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className='flex justify-between items-center mb-3'>
        <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-800'>
          <FaMapMarkerAlt className='text-red-500 text-xl' />
          Address
        </h3>

        <motion.button
          className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${
            isCopied
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } transition-colors`}
          title='Copy address to clipboard'
          disabled={isCopied}
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 10 }}
          animate={{
            opacity: isHovered || isCopied ? 1 : 0,
            x: isHovered || isCopied ? 0 : 10,
          }}
        >
          {isCopied ? (
            <>
              <FaCheck className='text-green-600' />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <FaCopy />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      <div className='space-y-2'>
        <p className='text-gray-700 text-[16px] leading-relaxed'>{address}</p>
        <div className='flex items-center gap-2'>
          <Tooltip
            title='Postal/Zip Code'
            placement='top'
            color='#2f855a'
            className='text-xs'
          >
            <div className='inline-flex items-center bg-green-50 rounded-full px-3 py-1 border border-green-100 shadow-sm hover:bg-green-100 transition-colors'>
              <BsMailbox2Flag className='text-sm text-green-600 mr-2' />
              <span className='text-xs font-bold text-green-800'>
                {postcode}
              </span>
            </div>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
};
