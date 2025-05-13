// components/SearchBar/SearchBar.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Space } from "antd";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { FaTimes } from "react-icons/fa"; // Add this import for the close button

// Redux actions and selectors
import {
  setSearchTerm,
  setSuggestions,
  setSelectedPlace,
  setSelectedCategories,
  setSelectedInternationalPlace,
  setSearchCenter,
  setNearbyPlaces,
} from "@/app/store/slices/searchSlice";
import {
  selectSearchTerm,
  selectSuggestions,
  selectSearchMode,
} from "@/app/store/selectors/searchSelectors";
import {
  closeDrawer,
  openDrawer,
  openLeftBar,
} from "@/app/store/slices/drawerSlice";
import { fetchPlaceDetails } from "@/app/store/thunks/searchThunks";

// Custom hooks
import { useSearchHandler } from "../../hooks/useSearchHandler";
import { getSuggestionOptions } from "../../hooks/useSuggestionsOptions";
import useWindowSize from "@/app/hooks/useWindowSize";

// Components
import ClearButton from "../ClearButton";
import DirectionsToggle from "../DirectionToggle";
import SearchInput from "../SearchInput";
import CountrySelect from "../CountrySelect/CountrySelect";
import NearbyResults from "../NearbyResults/NearbyResults";
import DirectionsPanel from "../DirectionsPanel/DirectionsPanel";

// Styles
import "./styles.css";

const SearchBar: React.FC = () => {
  // Redux hooks
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);
  const suggestions = useAppSelector(selectSuggestions);
  const searchMode = useAppSelector(selectSearchMode);
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);
  const placeDetails = useAppSelector((state) => state.search.placeDetails);
  const searchError = useAppSelector((state) => state.search.placeDetailsError);
  const selectedCategories = useAppSelector(
    (state) => state.search.selectedCategories
  );
  const showNearbyResults = selectedCategories.length > 0;
  // Local state
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [directSearchError, setDirectSearchError] = useState<string | null>(
    null
  );

  // Custom hooks
  const { handleSearch } = useSearchHandler(dispatch);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 640;

  // Memoized values
  const options = useMemo(
    () => getSuggestionOptions(suggestions, searchTerm),
    [suggestions, searchTerm]
  );

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle suggestions visibility
  useEffect(() => {
    setIsExpanded(suggestions.length > 0);
  }, [suggestions]);

  // Handle animation states
  useEffect(() => {
    if (!isExpanded) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [isExpanded]);

  // Add effect to update search term based on placeDetails
  useEffect(() => {
    if (placeDetails) {
      const displayText =
        placeDetails.business_name || placeDetails.address || "";
      if (displayText) {
        dispatch(setSearchTerm(displayText));
      }
    }
  }, [placeDetails, dispatch]);

  // Add this effect
  useEffect(() => {
    // When nearby results appear, clear the search term
    if (showNearbyResults) {
      dispatch(setSearchTerm(""));
    }
  }, [showNearbyResults, dispatch]);

  // Clear error when search term changes
  useEffect(() => {
    setDirectSearchError(null);
  }, [searchTerm]);

  // Event handlers
  const handleSelect = (value: string, option: any) => {
    const selectedData = option.rawData;
    console.log("🚀 ~ handleSelect ~ selectedData:", selectedData);

    if (selectedData) {
      dispatch(setSelectedPlace(selectedData));
      dispatch(openLeftBar());

      // Only update URL and fetch place details if we have a uCode or place_code
      if (selectedData.uCode || selectedData.place_code) {
        dispatch(
          fetchPlaceDetails(selectedData.uCode || selectedData.place_code)
        );

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set(
          "place",
          selectedData.uCode || selectedData.place_code
        );
        window.history.replaceState({}, "", currentUrl.toString());
      } else if (selectedData.type !== "coordinates") {
        // Handle non-uCode places (like international places)
        dispatch(setSelectedInternationalPlace(selectedData));
      }
    }

    dispatch(setSearchTerm(value));
    dispatch(setSuggestions([]));
    setIsExpanded(false);
  };

  const handleInputChange = (value: string) => {
    dispatch(setSearchTerm(value));
    setDirectSearchError(null);

    // Check for "near me" or "nearme" searches
    const lowerValue = value.toLowerCase();
    const nearMePattern = /(.+?)\s*(?:near\s*me|nearme)$/i;

    if (nearMePattern.test(lowerValue)) {
      // Extract the category from the search text
      const match = lowerValue.match(nearMePattern);
      if (match && match[1]) {
        const category = match[1].trim();

        // If we have a valid category, trigger nearby search
        if (category) {
          // Capitalize first letter for consistency with your category format
          const formattedCategory =
            category.charAt(0).toUpperCase() + category.slice(1);
          dispatch(setSelectedCategories([formattedCategory]));
          return; // Skip regular search
        }
      }
    }
    // Perform regular search if not a "near me" query
    handleSearch(value);
  };

  const handleDropdownVisibility = (open: boolean) => {
    if (open && suggestions.length > 0) {
      setIsExpanded(true);
      if (isMobile) {
        dispatch(closeDrawer());
      }
    } else {
      setIsExpanded(false);
    }
  };

  const handleDirectSearch = async (value: string) => {
    try {
      // Check for "near me" searches first
      const lowerValue = value.toLowerCase();
      const nearMePattern = /(.+?)\s*(?:near\s*me|nearme)$/i;

      if (nearMePattern.test(lowerValue)) {
        const match = lowerValue.match(nearMePattern);
        if (match && match[1]) {
          const category = match[1].trim();
          if (category) {
            // Capitalize first letter for consistency with your category format
            const formattedCategory =
              category.charAt(0).toUpperCase() + category.slice(1);
            dispatch(setSelectedCategories([formattedCategory]));
            return; // Skip API call
          }
        }
      }

      // Regular direct search if not a "near me" query
      const formData = new FormData();
      formData.append("q", value);

      const response = await fetch("/api/rupantor", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const responseData = await response.json();

      const uCode = responseData.geocoded_address?.uCode;
      if (!uCode)
        throw new Error("No location found. Please try a different search.");

      if (uCode) {
        dispatch(fetchPlaceDetails(uCode));
        dispatch(openLeftBar());
      }
    } catch (error) {
      console.error("Search error:", error);
      setDirectSearchError(
        error instanceof Error
          ? error.message
          : "Search failed. Please try again."
      );
      throw error;
    }
  };

  // Handle closing nearby results
  const handleCloseNearbyResults = () => {
    dispatch(setSelectedCategories([]));
    dispatch(setSearchCenter(null));
    dispatch(setNearbyPlaces([]));
    if (placeDetails) {
      dispatch(openDrawer());
    }
  };

  // Determine what to render based on search mode
  const renderContent = () => {
    if (searchMode === "directions") {
      return <DirectionsPanel />;
    } else if (showNearbyResults) {
      return (
        <div className='flex flex-col'>
          {/* Header with close button */}
          <div className='flex items-center p-3 border-b'>
            <h3 className='text-base font-medium flex-1'>
              Nearby {selectedCategories.join(", ")}
            </h3>
            <button
              onClick={handleCloseNearbyResults}
              className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'
              aria-label='Close nearby results'
            >
              <FaTimes />
            </button>
          </div>

          {/* Embed NearbyResults component with fixed height and scrolling */}
          <div className='max-h-[60vh] overflow-y-auto pointer-events-auto'>
            <NearbyResults />
          </div>
        </div>
      );
    } else {
      return (
        <div className='flex items-center gap-2'>
          {/* Search input and clear button */}
          <div className='relative w-full'>
            <SearchInput
              value={searchTerm}
              options={options}
              placeholder='Search places...'
              isExpanded={isExpanded}
              isAnimating={isAnimating}
              onSearch={handleInputChange}
              onSelect={handleSelect}
              onChange={handleInputChange}
              onBlur={() => setIsExpanded(false)}
              onDropdownVisibleChange={handleDropdownVisibility}
              onDirectSearch={handleDirectSearch}
              error={directSearchError || searchError}
            />
            <ClearButton searchTerm={searchTerm} />
          </div>

          {/* Additional controls */}
          <Space size={0} className='!ml-2'>
            <DirectionsToggle />
            <CountrySelect />
          </Space>
        </div>
      );
    }
  };

  return (
    <>
      {/* Main search container */}
      <div
        className={`relative left-0 w-screen ${
          isMounted
            ? windowSize.width > 823
              ? "z-[1001]"
              : "z-10"
            : "z-[1001]"
        } min-w-[300px] sm:top-4 lg:left-4 sm:w-full sm:max-w-[400px]`}
      >
        {/* Search box wrapper */}
        <div
          className={`bg-white transition-all duration-100 ${
            isExpanded || showNearbyResults || searchMode === "directions"
              ? `${
                  isVisible
                    ? `${
                        showNearbyResults || searchMode === "directions"
                          ? "rounded-bl-2xl rounded-br-2xl pb-3"
                          : "rounded-none"
                      }`
                    : "rounded-t-[20px]"
                } sm:rounded-t-[20px]`
              : "rounded-none sm:rounded-full"
          } shadow-deep`}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
