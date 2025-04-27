import { useAppSelector } from '@/app/store/store';
import SearchBar from '../search/components/SearchBar/SearchBar';
import NearbyCategories from '../search/components/NearbyCategories/NearbyCategories';
import MobileAppLink from '../common/TopPanel/MobileAppLink';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { TbBulb } from 'react-icons/tb';

const MapContainer = dynamic(() => import('../map/MapContainer/MapContainer'), {
  ssr: false,
});

const MainContent = () => {
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);
  const isMapLoaded = useAppSelector((state) => state.map.isMapLoaded); // Get map loaded state from Redux

  // Fun facts array
  const funFacts = [
    'Did you know? Barikoi Maps powers over 1 million users worldwide!',
    'Did you know? Barikoi supports over 50,000 businesses with location data.',
    'Did you know? Barikoi Maps is optimized for fast and reliable navigation.',
    'Did you know? Barikoi provides geolocation services for developers and enterprises.',
    'Did you know? Barikoi Maps is trusted by leading companies for accurate mapping.',
  ];

  const [currentFact, setCurrentFact] = useState(0);

  // Rotate fun facts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 3000); // Change fact every 3 seconds
    return () => clearInterval(interval);
  }, [funFacts.length]);

  return (
    <main className="relative w-full h-screen">
      {!isMapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/80 backdrop-blur-md z-50">
          <div className="flex flex-col items-center">
            <Image
              src="/images/Loading/Rotating Earth.gif"
              alt="Loading..."
              width={160}
              height={160}
              className="mb-4 opacity-70"
            />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Hold tight, we are going to land on
            </p>
            <Image
              src="/images/barikoi-logo.svg"
              alt="Barikoi Logo"
              width={150}
              height={50}
              priority
            />
            <p className="text-2xl font-semibold text-gray-700 mt-4">Maps!</p>
          </div>
          {/* Fun Facts Section */}
          <div className="absolute bottom-8 text-center px-4">
            <div className="inline-flex items-center bg-white px-4 py-2 rounded-lg shadow-md">
              <TbBulb className="text-amber-500 text-5xl" />
              <p className="text-lg font-semibold text-green-600 italic">
                {funFacts[currentFact]}
              </p>
            </div>
          </div>
        </div>
      )}

      <>
        {isMapLoaded && <MobileAppLink />}
        <MapContainer />
        <div
          className={`absolute ${
            isVisible ? `top-[53px] sm:top-0` : `top-2`
          } left-0 w-full flex flex-row flex-wrap justify-center z-10 gap-6`}
        >
          <SearchBar />
          <NearbyCategories />
        </div>
      </>
    </main>
  );
};

export default MainContent;
