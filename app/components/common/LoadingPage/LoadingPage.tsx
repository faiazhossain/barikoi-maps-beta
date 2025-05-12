// components/common/LoadingPage/LoadingPage.tsx
import Image from "next/image";
import { TbBulb, TbCloudOff, TbWifiOff } from "react-icons/tb";
import { useEffect, useState } from "react";

const funFacts = [
  "Did you know? Barikoi Maps powers over 1 million users worldwide!",
  "Did you know? Barikoi supports over 50,000 businesses with location data.",
  "Did you know? Barikoi Maps is optimized for fast and reliable navigation.",
  "Did you know? Barikoi provides geolocation services for developers and enterprises.",
  "Did you know? Barikoi Maps is trusted by leading companies for accurate mapping.",
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
    <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-100/60 backdrop-blur-sm z-[1002] overflow-hidden'>
      {/* Background Video */}
      <video
        src='/images/Loading/Spinning-Earth.webm'
        autoPlay
        playsInline
        loop
        muted
        className='absolute w-[200%] h-[200%] object-cover opacity-10'
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(2px)",
        }}
      />

      {/* Content Overlay */}
      <div className='relative z-10 flex flex-col items-center bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-lg'>
        <p className='text-xl font-semibold text-gray-800 mb-3 animate-fade-in'>
          Hold tight, we are going to land on
        </p>
        <div className='transform hover:scale-105 transition-transform duration-300'>
          <Image
            src='/images/barikoi-logo.svg'
            alt='Barikoi Logo'
            width={180}
            height={60}
            priority
            className='animate-float'
          />
        </div>
        <p className='text-3xl font-bold text-gray-800 mt-4 animate-fade-in'>
          Maps!
        </p>
      </div>

      {/* Fun Facts Section */}
      <div className='relative z-10 mt-12 text-center px-4 animate-slide-up'>
        <div className='inline-flex items-center bg-white/80 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/90'>
          <TbBulb className='text-amber-500 text-4xl mr-3 animate-pulse' />
          <p className='text-lg font-medium text-gray-700 italic'>
            {funFacts[currentFact]}
          </p>
        </div>
      </div>

      {/* Timeout Messages */}
      <div className='relative z-10 animate-fade-in'>
        {renderTimeoutMessage()}
      </div>
    </div>
  );
};

export default LoadingPage;
