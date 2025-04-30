// components/common/LoadingPage/LoadingPage.tsx
import Image from 'next/image';
import { TbBulb, TbCloudOff, TbWifiOff } from 'react-icons/tb';
import { useEffect, useState } from 'react';

const funFacts = [
  'Did you know? Barikoi Maps powers over 1 million users worldwide!',
  'Did you know? Barikoi supports over 50,000 businesses with location data.',
  'Did you know? Barikoi Maps is optimized for fast and reliable navigation.',
  'Did you know? Barikoi provides geolocation services for developers and enterprises.',
  'Did you know? Barikoi Maps is trusted by leading companies for accurate mapping.',
];

interface LoadingPageProps {
  currentFact: number;
}

const LoadingPage = ({ currentFact }: LoadingPageProps) => {
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
        <div className='mt-6 p-4 bg-red-100 rounded-lg flex items-center gap-3'>
          <TbCloudOff className='text-red-500 text-2xl' />
          <p className='text-red-700 font-medium'>
            Might be the server is down. Please try again later.
          </p>
        </div>
      );
    } else if (elapsedTime >= 22) {
      return (
        <div className='mt-6 p-4 bg-orange-100 rounded-lg flex items-center gap-3'>
          <TbCloudOff className='text-orange-500 text-2xl' />
          <p className='text-orange-700 font-medium'>
            Still loading... Server might be experiencing issues.
          </p>
        </div>
      );
    } else if (elapsedTime >= 10) {
      return (
        <div className='mt-6 p-4 bg-yellow-100 rounded-lg flex items-center gap-3'>
          <TbWifiOff className='text-yellow-500 text-2xl' />
          <p className='text-yellow-700 font-medium'>
            Taking too long to load? Check your internet connection.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-100/80 backdrop-blur-md z-[1002]'>
      {/* Background Video */}
      <video
        src='/images/Loading/Rotating-Earth.webm'
        autoPlay
        playsInline
        loop
        muted
        className='absolute scale-125 -inset-2 w-full h-full object-cover opacity-10'
      />

      {/* Content Overlay */}
      <div className='relative z-10 flex flex-col items-center'>
        <p className='text-lg font-semibold text-gray-700 mb-2'>
          Hold tight, we are going to land on
        </p>
        <Image
          src='/images/barikoi-logo.svg'
          alt='Barikoi Logo'
          width={150}
          height={50}
          priority
        />
        <p className='text-2xl font-semibold text-gray-700 mt-4'>Maps!</p>
      </div>

      {/* Fun Facts Section */}
      <div className='relative z-10 mt-10 text-center px-4'>
        <div className='inline-flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md'>
          <TbBulb className='text-amber-500 text-5xl' />
          <p className='text-lg font-semibold text-green-600 italic'>
            {funFacts[currentFact]}
          </p>
        </div>
      </div>

      {/* Timeout Messages */}
      {renderTimeoutMessage()}
    </div>
  );
};

export default LoadingPage;
