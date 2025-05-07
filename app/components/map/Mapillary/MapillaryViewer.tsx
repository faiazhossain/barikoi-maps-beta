import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  FaTimes,
  FaCompass,
  FaCalendarAlt,
  FaUser,
  FaSyncAlt,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapillaryImageData,
  fetchMapillaryImageData,
  formatDate,
  getMapillaryViewerUrl,
} from './MapillaryUtils';
import Image from 'next/image';

interface MapillaryViewerProps {
  imageId: string;
  onClose: () => void;
}

const MapillaryViewer: React.FC<MapillaryViewerProps> = ({
  imageId,
  onClose,
}) => {
  const [imageData, setImageData] = useState<MapillaryImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  // Load image data when component mounts
  useEffect(() => {
    const loadImageData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMapillaryImageData(imageId);
        if (data) {
          setImageData(data);
        } else {
          setError('Failed to load image data');
        }
      } catch (err) {
        setError('An error occurred while loading the image');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadImageData();
  }, [imageId]);

  // Handle escape key to close viewer
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent scrolling on body when viewer is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [handleKeyDown]);

  // Toggle info panel
  const toggleInfo = () => {
    setShowInfo((prev) => !prev);
  };

  // Generate street view link
  const viewerUrl = getMapillaryViewerUrl(imageId);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-50 bg-black flex items-center justify-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Close button */}
        <button
          className='absolute top-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-colors'
          onClick={onClose}
          aria-label='Close viewer'
        >
          <FaTimes size={24} />
        </button>

        {/* Image container */}
        <div className='relative w-full h-full'>
          {loading ? (
            <div className='flex items-center justify-center h-full'>
              <FaSyncAlt className='text-white text-4xl animate-spin' />
            </div>
          ) : error ? (
            <div className='flex flex-col items-center justify-center h-full text-white'>
              <div className='text-xl mb-4'>{error}</div>
              <button
                className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors'
                onClick={onClose}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* The image */}
              <Image
                src={
                  imageData?.thumb_2048_url ||
                  `https://thumbnails-external-a.mapillary.com/v/thumbs/2048/${imageId}`
                }
                width={2048}
                height={1024}
                alt='Street view'
                className='w-full h-full object-contain'
              />

              {/* Information overlay */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 shadow-lg'
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                  >
                    <div className='max-w-3xl mx-auto space-y-2'>
                      <div className='text-xl font-semibold mb-2'>
                        Street View Image
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='flex items-center'>
                          <FaCalendarAlt className='mr-2' />
                          <span>
                            Captured:{' '}
                            {imageData?.captured_at
                              ? formatDate(imageData.captured_at)
                              : 'Unknown'}
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <FaCompass className='mr-2' />
                          <span>
                            Direction:{' '}
                            {imageData?.compass_angle
                              ? Math.round(imageData.compass_angle) + '°'
                              : 'Unknown'}
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <FaUser className='mr-2' />
                          <span>
                            By: {imageData?.creator?.username || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <div className='flex justify-end mt-3'>
                        <a
                          href={viewerUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors mr-2'
                        >
                          <FaExternalLinkAlt className='mr-2' />
                          View on Mapillary
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle info button */}
              <button
                className='absolute bottom-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-colors'
                onClick={toggleInfo}
                aria-label={showInfo ? 'Hide info' : 'Show info'}
              >
                <FaCompass size={20} />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default MapillaryViewer;
