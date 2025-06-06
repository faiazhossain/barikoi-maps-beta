// components/ActionButtons.tsx
import React, { useState } from "react";
import { FaShareAlt, FaMapMarkerAlt, FaEdit, FaCheck } from "react-icons/fa";
import { MdDirections } from "react-icons/md";
import { motion } from "framer-motion";
import ShareModal from "./ShareModal";
import SuggestEditModal from "./SuggestEditModal";
import { useAppSelector, useAppDispatch } from "@/app/store/store";
import {
  setSelectedCategories,
  setSearchMode,
  setNearbyPlaces,
} from "@/app/store/slices/searchSlice";
import { setViewport, toggleDirections } from "@/app/store/slices/mapSlice";
import { closeDrawer } from "@/app/store/slices/drawerSlice";
import {
  setDestination,
  setDestinationSearch,
} from "@/app/store/slices/directionsSlice";
import { setSearchCenter } from "@/app/store/slices/searchSlice";

export const ActionButtons = () => {
  const dispatch = useAppDispatch();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSuggestEditModalOpen, setIsSuggestEditModalOpen] = useState(false);
  const placeDetails = useAppSelector((state) => state.search.placeDetails);
  const handleActionClick = (action: string) => {
    if (action === "share") {
      setIsShareModalOpen(true);
    } else if (action === "nearby") {
      handleNearbyClick();
    } else if (action === "directions") {
      handleDirectionsClick();
    } else if (action === "edit") {
      setIsSuggestEditModalOpen(true);
    }

    setActiveAction(action);
    setTimeout(() => setActiveAction(null), 1500);
  };

  // Handle the nearby action when a user clicks the "Nearby" button
  const handleNearbyClick = () => {
    dispatch(setSearchCenter(null)); // Reset search center
    dispatch(setSelectedCategories([])); // Clear selected categories
    dispatch(setNearbyPlaces([]));
    if (placeDetails && placeDetails.latitude && placeDetails.longitude) {
      // Get place coordinates
      const lat = parseFloat(placeDetails.latitude);
      const lng = parseFloat(placeDetails.longitude);

      // Set the search center for nearby places
      dispatch(setSearchCenter({ latitude: lat, longitude: lng }));

      // Update the map viewport to center on the selected place
      dispatch(
        setViewport({
          latitude: lat,
          longitude: lng,
          zoom: 16,
        })
      );

      // Set the selected category to trigger nearby search
      dispatch(setSelectedCategories(["Restaurant"]));

      // Close the drawer to show the map and nearby results
      dispatch(closeDrawer());
    }
  };

  // Handle the directions action when a user clicks the "Directions" button
  const handleDirectionsClick = () => {
    if (placeDetails && placeDetails.latitude && placeDetails.longitude) {
      // Get place coordinates
      const lat = parseFloat(placeDetails.latitude);
      const lng = parseFloat(placeDetails.longitude);
      const name =
        placeDetails.business_name ||
        placeDetails.address ||
        "Selected location";

      // Set as destination in the directions panel
      dispatch(
        setDestination({
          latitude: lat,
          longitude: lng,
          address: name,
          placeCode: placeDetails.place_code,
        })
      );

      // Set the destination search text
      dispatch(setDestinationSearch(name));

      // Set the search mode to directions
      dispatch(setSearchMode("directions"));

      // Make sure the directions panel is visible
      dispatch(toggleDirections());

      // Close the drawer to show the map with directions
      dispatch(closeDrawer());
    }
  };

  const getShareInfo = () => {
    if (!placeDetails) return null;

    return {
      name: placeDetails.place_name,
      address: placeDetails.address,
      coordinates: {
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude,
      },
      url: `https://maps.barikoi.com/place/${placeDetails.place_code}`,
      uCode: placeDetails.place_code,
    };
  };

  const buttons = [
    { icon: <FaShareAlt />, label: "Share", action: "share" },
    { icon: <MdDirections />, label: "Directions", action: "directions" },
    { icon: <FaMapMarkerAlt />, label: "Nearby", action: "nearby" },
    { icon: <FaEdit />, label: "Suggest Edit", action: "edit" },
  ];
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex justify-between py-4 px-2 border-y border-gray-200 bg-gray-50 rounded-lg'
      >
        {buttons.map((btn) => (
          <motion.button
            key={btn.action}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center text-xs w-full ${
              activeAction === btn.action
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            } transition-colors`}
            onClick={() => handleActionClick(btn.action)}
          >
            <div className='relative'>
              <div
                className={`p-2 rounded-full ${
                  activeAction === btn.action ? "bg-blue-100" : "bg-white"
                } transition-colors`}
              >
                {activeAction === btn.action ? (
                  <FaCheck className='text-lg text-blue-600' />
                ) : (
                  React.cloneElement(btn.icon, { className: "text-lg" })
                )}
              </div>
            </div>
            <span className='mt-1.5 font-medium'>{btn.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {placeDetails && (
        <>
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            placeInfo={
              getShareInfo() || {
                name: "",
                address: "",
                coordinates: { latitude: 0, longitude: 0 },
                url: "",
                uCode: "",
              }
            }
          />
          <SuggestEditModal
            isOpen={isSuggestEditModalOpen}
            onClose={() => setIsSuggestEditModalOpen(false)}
          />
        </>
      )}
    </>
  );
};
