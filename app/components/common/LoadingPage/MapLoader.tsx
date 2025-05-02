'use client';

import React, { useState, useEffect } from 'react';
import { TbCloudOff, TbWifiOff } from 'react-icons/tb';

interface MapLoaderProps {
  width?: number; // Optional width in pixels
  height?: number; // Optional height in pixels
  spinnerSize?: number; // Optional size for the spinner (defaults to 100)
  className?: string; // Optional additional className
  style?: React.CSSProperties; // Optional additional styles
}

const MapLoader: React.FC<MapLoaderProps> = ({
  width = 200,
  height = 230,
  spinnerSize = 180,
  className = '',
  style = {},
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderTimeoutMessage = () => {
    if (elapsedTime >= 35) {
      return (
        <div className='bg-red-100 rounded-lg flex items-center gap-3 p-2 mt-2'>
          <TbCloudOff className='text-red-500 text-xl' />
          <p className='text-red-700 font-medium text-xs'>
            Server might be down
          </p>
        </div>
      );
    } else if (elapsedTime >= 22) {
      return (
        <div className='bg-orange-100 rounded-lg flex items-center gap-3 p-2 mt-2'>
          <TbCloudOff className='text-orange-500 text-xl' />
          <p className='text-orange-700 font-medium text-xs'>
            Server experiencing issues
          </p>
        </div>
      );
    } else if (elapsedTime >= 10) {
      return (
        <div className='bg-yellow-100 rounded-lg flex items-center gap-3 p-2 mt-2'>
          <TbWifiOff className='text-yellow-500 text-xl' />
          <p className='text-yellow-700 font-medium text-xs'>
            Check your connection
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: `${width}px`,
        height: `${height}px`,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Background Video */}
      <video
        src='/images/Loading/Spinning-Earth.webm'
        autoPlay
        playsInline
        loop
        muted
        className='absolute inset-0 w-full h-full object-cover opacity-30'
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          margin: '0 auto',
        }}
      />

      {/* Content Overlay */}
      <div className='relative z-10 flex flex-col items-center w-full'>
        {/* Loading Text with Dots */}
        <p
          style={{
            color: '#333',
            fontSize: '14px',
            fontWeight: '500',
            margin: 0,
            marginBottom: '8px',
          }}
        >
          Loading<span className='dot one'>.</span>
          <span className='dot two'>.</span>
          <span className='dot three'>.</span>
        </p>
        {renderTimeoutMessage()}
      </div>

      <style jsx>{`
        .dot {
          opacity: 0;
          animation: blink 1.4s infinite;
        }
        .dot.one {
          animation-delay: 0s;
        }
        .dot.two {
          animation-delay: 0.2s;
        }
        .dot.three {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MapLoader;
