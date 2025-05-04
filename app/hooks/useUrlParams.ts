import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { openLeftBar } from '../store/slices/drawerSlice';
import {
  fetchPlaceDetails,
  fetchReverseGeocode,
} from '../store/thunks/searchThunks';

export const useUrlParams = () => {
  const dispatch = useAppDispatch();
  const placeDetails = useAppSelector((state) => state.search.placeDetails);

  // Handle URL parameters and navigation
  useEffect(() => {
    const handleUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const placeCode = urlParams.get('place');
      const revCoords = urlParams.get('rev');

      // First priority - handle place code
      if (placeCode && placeCode.trim()) {
        dispatch(fetchPlaceDetails(placeCode));
        dispatch(openLeftBar());
      }
      // Second priority - handle reverse geocoding coordinates
      else if (revCoords && revCoords.trim()) {
        const [latitudeStr, longitudeStr] = revCoords
          .split(',')
          .map((coord) => coord.trim());
        const latitude = parseFloat(latitudeStr || '0');
        const longitude = parseFloat(longitudeStr || '0');

        // Validate coordinates before dispatching
        if (
          !isNaN(latitude) &&
          !isNaN(longitude) &&
          latitude >= -90 &&
          latitude <= 90 &&
          longitude >= -180 &&
          longitude <= 180
        ) {
          dispatch(fetchReverseGeocode({ latitude, longitude }));
          dispatch(openLeftBar());
        }
      }
    };

    handleUrlParams();
    window.addEventListener('popstate', handleUrlParams);
    return () => window.removeEventListener('popstate', handleUrlParams);
  }, [dispatch]);

  // Update URL when place details change
  useEffect(() => {
    const currentUrl = new URL(window.location.href);

    if (placeDetails?.place_code || placeDetails?.uCode) {
      // Update URL only if we have a valid place code
      currentUrl.searchParams.set(
        'place',
        placeDetails.place_code || placeDetails.uCode
      );
      // Remove rev parameter if place is set
      currentUrl.searchParams.delete('rev');
      window.history.replaceState({}, '', currentUrl.toString());
    } else if (currentUrl.searchParams.has('place')) {
      // Remove place parameter if no valid code exists
      currentUrl.searchParams.delete('place');
      window.history.replaceState({}, '', currentUrl.toString());
    }
  }, [placeDetails]);
};
