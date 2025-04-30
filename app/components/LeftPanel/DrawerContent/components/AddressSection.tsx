import React, { useState } from 'react';
import { FaCopy, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';

interface AddressSectionProps {
  address: string;
  holdingNumber: string;
  roadNameNumber: string;
  area: string;
  city: string;
  postcode: string;
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
    <div
      className='space-y-3 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer relative'
      onClick={copyToClipboard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='flex justify-between items-center'>
        <h3 className='flex items-center gap-2 text-md font-bold text-gray-700'>
          <FaMapMarkerAlt className='text-red-500' />
          Address
        </h3>

        {(isHovered || isCopied) && (
          <button
            className={`flex items-center gap-1 text-sm ${
              isCopied ? 'text-green-800' : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
            title='Copy address to clipboard'
            disabled={isCopied}
            onClick={(e) => e.stopPropagation()}
          >
            {isCopied ? (
              <>
                <FaCheck className='text-green-800' />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <FaCopy />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className='space-y-1 text-[16px] text-gray-600'>
        {address},
        <span className='text-sm text-gray-600 w-fit bg-green-100 rounded-sm p-1 ml-2'>
          {postcode}
        </span>
      </div>
    </div>
  );
};
