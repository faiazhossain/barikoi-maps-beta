import React, { useEffect } from 'react';
import { NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setIsLargeScreen } from '@/app/store/slices/uiSlice';

const MapControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLargeScreen = useAppSelector((state) => state.ui.isLargeScreen);

  useEffect(() => {
    // Initial check
    dispatch(setIsLargeScreen(window.innerWidth > 640));

    // Add resize listener
    const handleResize = () => {
      dispatch(setIsLargeScreen(window.innerWidth > 640));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <>
      {' '}
      {isLargeScreen && (
        <>
          <NavigationControl position='bottom-right' />
        </>
      )}{' '}
      <GeolocateControl
        position='bottom-right'
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        showUserLocation={true}
        showAccuracyCircle={true}
      />
    </>
  );
};

export default React.memo(MapControls);
