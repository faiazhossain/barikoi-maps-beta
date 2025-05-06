import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/app/hooks/useMediaQuery';
import { IoClose } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setTopPanelVisible } from '@/app/store/slices/uiSlice';

const MobileAppLink: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);

  const getStoreLink = () => {
    if (typeof window !== 'undefined') {
      // Check for iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      // Check for Android
      const isAndroid = /Android/.test(navigator.userAgent);

      if (isIOS) {
        return 'https://apps.apple.com/us/app/barikoi-maps/id6467561152';
      } else if (isAndroid) {
        return 'https://play.google.com/store/apps/details?id=com.barikoi.barikoi&pcampaignid=web_share';
      }
      // Return default store link if device type cannot be determined
      return 'https://barikoi.com/';
    }
    return '#';
  };

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className='fixed top-0 left-0 w-full bg-white z-50 px-4 py-2 shadow-sm'
        >
          <div className='flex justify-between items-center relative px-4'>
            <Image
              src='/images/barikoi-logo.svg'
              alt='Barikoi Logo'
              width={80}
              height={20}
              className='object-contain'
            />
            <motion.a
              href={getStoreLink()}
              target='_blank'
              rel='noopener noreferrer'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-primary/90 transition-colors'
            >
              Get App
            </motion.a>
            <motion.button
              className='absolute -top-2 -right-2 p-1 rounded-full bg-white shadow-md text-gray-500 hover:text-primary'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(setTopPanelVisible(false))}
            >
              <IoClose size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileAppLink;
