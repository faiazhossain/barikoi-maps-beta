'use client';

import React from 'react';

interface ImageLoaderProps {
  aspectRatio?: string; // e.g. "16/9", "4/3", "1/1"
  className?: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  aspectRatio = '4/3',
  className = '',
}) => {
  return (
    <div
      className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Animated gradient background */}
      <div className='absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-gradient-shift bg-[length:200%_100%]' />

      {/* Loading indicator */}
      <div className='absolute inset-0 flex flex-col items-center justify-center gap-3'>
        {/* SVG spinner */}
        <svg
          className='w-8 h-8 text-gray-400 animate-spin'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80378 19.1414 5'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>

        {/* Progress text with animated dots */}
        <div className='flex items-center text-gray-500 text-sm font-medium'>
          <span>Loading image</span>
          <span className='loading-dots'>
            <span className='dot'>.</span>
            <span className='dot'>.</span>
            <span className='dot'>.</span>
          </span>
        </div>
      </div>

      <style jsx>{`
        .animate-gradient-shift {
          animation: gradientShift 2s ease infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .loading-dots .dot {
          opacity: 0;
          animation: dotPulse 1.5s infinite;
        }

        .loading-dots .dot:nth-child(1) {
          animation-delay: 0.2s;
        }

        .loading-dots .dot:nth-child(2) {
          animation-delay: 0.4s;
        }

        .loading-dots .dot:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes dotPulse {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageLoader;
