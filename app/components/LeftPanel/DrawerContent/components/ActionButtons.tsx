// components/ActionButtons.tsx
import React, { useState } from 'react';
import { FaShareAlt, FaMapMarkerAlt, FaEdit, FaCheck } from 'react-icons/fa';
import { MdDirections } from 'react-icons/md';
import { motion } from 'framer-motion';
import ShareModal from './ShareModal';
import { useAppSelector } from '@/app/store/store';

export const ActionButtons = () => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const placeDetails = useAppSelector((state) => state.search.placeDetails);

  const handleActionClick = (action: string) => {
    if (action === 'share') {
      setIsShareModalOpen(true);
    }
    setActiveAction(action);
    setTimeout(() => setActiveAction(null), 1500);
  };

  const getShareInfo = () => {
    if (!placeDetails) return null;

    return {
      name: placeDetails.place_name,
      address: placeDetails.address,
      coordinates: {
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude,
      },
      url: `https://maps.barikoi.com/place/${placeDetails.place_code}`,
      uCode: placeDetails.place_code,
    };
  };

  const buttons = [
    { icon: <FaShareAlt />, label: 'Share', action: 'share' },
    { icon: <MdDirections />, label: 'Directions', action: 'directions' },
    { icon: <FaMapMarkerAlt />, label: 'Nearby', action: 'nearby' },
    { icon: <FaEdit />, label: 'Suggest Edit', action: 'edit' },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex justify-between py-4 px-2 border-y border-gray-200 bg-gray-50 rounded-lg'
      >
        {buttons.map((btn) => (
          <motion.button
            key={btn.action}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center text-xs w-full ${
              activeAction === btn.action
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            } transition-colors`}
            onClick={() => handleActionClick(btn.action)}
          >
            <div className='relative'>
              <div
                className={`p-2 rounded-full ${
                  activeAction === btn.action ? 'bg-blue-100' : 'bg-white'
                } transition-colors`}
              >
                {activeAction === btn.action ? (
                  <FaCheck className='text-lg text-blue-600' />
                ) : (
                  React.cloneElement(btn.icon, { className: 'text-lg' })
                )}
              </div>
            </div>
            <span className='mt-1.5 font-medium'>{btn.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {placeDetails && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          placeInfo={
            getShareInfo() || {
              name: '',
              address: '',
              coordinates: { latitude: 0, longitude: 0 },
              url: '',
              uCode: '',
            }
          }
        />
      )}
    </>
  );
};
