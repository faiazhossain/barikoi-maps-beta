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
    if (placeDetails?.place_code || placeDetails?.uCode) {
      // First get the current URL parts
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      // Construct the new URL with place parameter
      const placeCode = placeDetails.place_code || placeDetails.uCode;
      const newUrl = `${pathname}?place=${placeCode}${hash}`;

      // Update URL without encoding
      window.history.replaceState({}, '', newUrl);
    } else if (placeDetails?.latitude && placeDetails?.longitude) {
      // First get the current URL parts
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      // Construct the new URL with rev parameter (coordinates)
      const coords = `${placeDetails.latitude},${placeDetails.longitude}`;
      const newUrl = `${pathname}?rev=${coords}${hash}`;

      // Update URL without encoding
      window.history.replaceState({}, '', newUrl);
    }
  }, [placeDetails]);
};
