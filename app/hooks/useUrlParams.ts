import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { openLeftBar } from '../store/slices/drawerSlice';
import { fetchPlaceDetails } from '../store/thunks/searchThunks';

export const useUrlParams = () => {
  const dispatch = useAppDispatch();
  const placeDetails = useAppSelector((state) => state.search.placeDetails);

  // Handle URL parameters and navigation
  useEffect(() => {
    const handleUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const placeCode = urlParams.get('place');

      if (placeCode && placeCode.trim()) {
        dispatch(fetchPlaceDetails(placeCode));
        dispatch(openLeftBar());
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
      window.history.replaceState({}, '', currentUrl.toString());
    } else if (currentUrl.searchParams.has('place')) {
      // Remove place parameter if no valid code exists
      currentUrl.searchParams.delete('place');
      window.history.replaceState({}, '', currentUrl.toString());
    }
  }, [placeDetails]);
};
