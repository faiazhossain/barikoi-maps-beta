import { FaLocationDot, FaHashtag, FaCopy, FaCheck } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useState } from 'react';

const LocationMeta = ({ placeDetails }) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='px-3 py-2 bg-gray-50 rounded-lg border border-gray-50 text-sm text-gray-600'
    >
      <div className='flex flex-col gap-2'>
        {/* Coordinates */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FaLocationDot className='text-blue-500 text-sm' />
            <span className='font-medium'>Location:</span>
            <span className='font-mono text-xs'>
              {placeDetails.latitude}, {placeDetails.longitude}
            </span>
          </div>
          <button
            onClick={() =>
              copyToClipboard(
                `${placeDetails.latitude}, ${placeDetails.longitude}`,
                'location'
              )
            }
            className='text-gray-400 hover:text-blue-500 transition-colors'
            title='Copy coordinates'
          >
            {copiedItem === 'location' ? (
              <FaCheck className='text-green-500 text-xs' />
            ) : (
              <FaCopy className='w-3 h-3' />
            )}
          </button>
        </div>

        {/* Place code */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FaHashtag className='text-blue-500 text-sm' />
            <span className='font-medium'>Code:</span>
            <span className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded'>
              {placeDetails.place_code}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(placeDetails.place_code, 'code')}
            className='text-gray-400 hover:text-blue-500 transition-colors'
            title='Copy place code'
          >
            {copiedItem === 'code' ? (
              <FaCheck className='text-green-500 text-xs' />
            ) : (
              <FaCopy className='w-3 h-3' />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationMeta;
