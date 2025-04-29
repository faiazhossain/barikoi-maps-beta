import React, { useState, useEffect } from 'react';
import { NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';

const MapControls: React.FC = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Initial check
    setIsLargeScreen(window.innerWidth > 640);

    // Add resize listener
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 640);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isLargeScreen && (
        <>
          <NavigationControl position="bottom-right" />
        </>
      )}
      <GeolocateControl position="bottom-right" />
    </>
  );
};

export default React.memo(MapControls);
