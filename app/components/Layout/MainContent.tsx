import { useAppSelector } from '@/app/store/store';
import SearchBar from '../search/components/SearchBar/SearchBar';
import MobileAppLink from '../common/TopPanel/MobileAppLink';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import LoadingPage from '../common/LoadingPage/LoadingPage';
import NearbyCategories from '../search/components/NearbyCategories/NearbyCategories';

const MapContainer = dynamic(() => import('../map/MapContainer/MapContainer'), {
  ssr: false,
});

const MainContent = () => {
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);
  const isMapillaryVisible = useAppSelector(
    (state) => state.mapillary.isVisible
  );
  const isMapLoaded = useAppSelector((state) => state.map.isMapLoaded);
  const selectedCategories = useAppSelector(
    (state) => state.search.selectedCategories
  );
  const showDirections = useAppSelector((state) => state.map.showDirections);
  console.log('🚀 ~ MainContent ~ showDirections:', showDirections);
  const showNearbyResults = selectedCategories.length > 0;

  const [currentFact, setCurrentFact] = useState(0);

  // Rotate fun facts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % 5); // 5 is the length of funFacts array
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className='relative w-full h-[100dvh] overflow-hidden'>
      {!isMapLoaded && <LoadingPage currentFact={currentFact} />}
      <>
        {isMapLoaded && <MobileAppLink />}
        <MapContainer />
        <div
          className={`absolute ${
            isVisible ? `top-[53px] sm:top-0` : `top-2`
          } left-0  flex flex-row flex-wrap ${
            !showNearbyResults && !showDirections
              ? 'justify-center w-full'
              : `justify-start w-fit`
          } gap-2 sm:gap-6 md:gap-11`}
        >
          {!isMapillaryVisible && <SearchBar />}
          {/* Only show NearbyCategories when not showing nearby results, not in mapillary mode, and not showing directions */}
          {!showNearbyResults && !isMapillaryVisible && !showDirections && (
            <NearbyCategories />
          )}
        </div>
      </>
    </main>
  );
};

export default MainContent;
