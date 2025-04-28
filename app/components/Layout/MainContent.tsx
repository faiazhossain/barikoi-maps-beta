import { useAppSelector } from '@/app/store/store';
import SearchBar from '../search/components/SearchBar/SearchBar';
import NearbyCategories from '../search/components/NearbyCategories/NearbyCategories';
import MobileAppLink from '../common/TopPanel/MobileAppLink';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import LoadingPage from '../common/InitialLoadingPage/LoadingPage';
import useWindowSize from '@/app/hooks/useWindowSize';

const MapContainer = dynamic(() => import('../map/MapContainer/MapContainer'), {
  ssr: false,
});

const MainContent = () => {
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);
  const isMapLoaded = useAppSelector((state) => state.map.isMapLoaded);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 640;
  const [currentFact, setCurrentFact] = useState(0);

  // Rotate fun facts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % 5); // 5 is the length of funFacts array
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden">
      {!isMapLoaded && <LoadingPage currentFact={currentFact} />}
      <>
        {isMapLoaded && <MobileAppLink />}
        <MapContainer />
        <div
          className={`absolute ${
            isVisible ? `top-[53px] sm:top-0` : `top-2`
          } left-0 w-full ${
            isMobile ? '!z-10' : '!z-[2001]'
          } flex flex-row flex-wrap justify-center gap-2 sm:gap-6`}
        >
          <SearchBar />
          <NearbyCategories />
        </div>
      </>
    </main>
  );
};

export default MainContent;
