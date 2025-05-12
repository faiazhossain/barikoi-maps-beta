"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "antd";
import { FaLayerGroup, FaTimes } from "react-icons/fa";
import { useAppSelector } from "@/app/store/store";
import Map, { useMap } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";

// Helper function to preload a map style
const preloadMapStyle = async (styleUrl: string) => {
  try {
    const response = await fetch(styleUrl);
    await response.json();
    return true;
  } catch (error) {
    console.error(`Error preloading style ${styleUrl}:`, error);
    return false;
  }
};

// Map style definitions with thumbnails, labels, and URLs
const MAP_STYLES = [
  {
    id: "default",
    name: "Default Style",
    url: "/map-styles/light-style.json",
  },
  {
    id: "barikoi-green",
    name: "Green Map",
    url: "https://map.barikoi.com/styles/barkoi_green/style.json?key=NDE2NzpVNzkyTE5UMUoy",
  },
  {
    id: "barikoi-dark",
    name: "Dark Map",
    url: "https://map.barikoi.com/styles/barikoi-dark-mode/style.json?key=NDE2NzpVNzkyTE5UMUoy",
  },
  {
    id: "planet-barikoi",
    name: "Planet Map",
    url: "https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=NDE2NzpVNzkyTE5UMUoy",
  },
  {
    id: "satellite",
    name: "Satellite View",
    url: "https://api.maptiler.com/maps/dfa2a215-243b-4b69-87ef-ce275b09249c/style.json?key=ASrfqapsZfy4BRFJJdVy",
  },
];

interface MapLayerSwitcherProps {
  onStyleChange: (styleUrl: string) => void;
  currentStyleUrl: string;
}

const MapLayerSwitcher: React.FC<MapLayerSwitcherProps> = ({
  onStyleChange,
  currentStyleUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadedStyles, setLoadedStyles] = useState<Set<string>>(new Set());
  const isLargeScreen = useAppSelector((state) => state.ui.isLargeScreen);
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );
  const { current: mainMap } = useMap();
  const [viewState, setViewState] = useState({
    longitude: 90.3938,
    latitude: 23.8103,
    zoom: 12,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
    width: 1,
    height: 1,
  });

  // Update viewState when main map moves
  useEffect(() => {
    if (!mainMap || !isOpen) return;

    const handleMove = () => {
      const center = mainMap.getCenter();
      setViewState({
        longitude: center.lng,
        latitude: center.lat,
        zoom: mainMap.getZoom() - 1,
        bearing: mainMap.getBearing(),
        pitch: mainMap.getPitch(),
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        width: mainMap.getContainer().clientWidth,
        height: mainMap.getContainer().clientHeight,
      });
    };

    mainMap.on("moveend", handleMove);
    handleMove();

    return () => {
      mainMap.off("moveend", handleMove);
    };
  }, [mainMap, isOpen]);

  // Preload map styles sequentially
  useEffect(() => {
    const preloadStyles = async () => {
      // Always preload the default style first
      const defaultStyle = MAP_STYLES[0];
      if (defaultStyle) {
        await preloadMapStyle(defaultStyle.url);
        setLoadedStyles((prev) => new Set(prev).add(defaultStyle.url));
      }

      // Preload remaining styles sequentially
      for (let i = 1; i < MAP_STYLES.length; i++) {
        const style = MAP_STYLES[i];
        if (style && style.url) {
          await preloadMapStyle(style.url);
        }
        if (style && style.url) {
          setLoadedStyles((prev) => new Set(prev).add(style.url));
        }
      }
    };

    preloadStyles();
  }, []);

  useEffect(() => {
    // Set the appropriate style based on selected country
    if (selectedCountry) {
      const styleToUse =
        selectedCountry === "Bangladesh"
          ? MAP_STYLES.find((style) => style.id === "default")?.url
          : MAP_STYLES.find((style) => style.id === "planet-barikoi")?.url;

      if (styleToUse && loadedStyles.has(styleToUse)) {
        onStyleChange(styleToUse);
      }
    }
  }, [selectedCountry, loadedStyles, onStyleChange]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleStyleSelect = useCallback(
    (styleUrl: string) => {
      if (loadedStyles.has(styleUrl)) {
        onStyleChange(styleUrl);
        setIsOpen(false);
      }
    },
    [loadedStyles, onStyleChange]
  );

  // Function to get panel position based on screen size
  const getPanelPosition = () => {
    if (isLargeScreen) {
      return "absolute bottom-0 right-12 bg-white shadow-xl rounded-lg overflow-hidden";
    }
    // On mobile, position from bottom
    return "fixed bottom-16 left-2 right-2 bg-white shadow-xl rounded-lg overflow-hidden";
  };

  // Render function for map style item with mini-map
  const renderMapStyleItem = (style: (typeof MAP_STYLES)[0]) => {
    const isLoaded = loadedStyles.has(style.url);
    const isActive = style.url === currentStyleUrl;

    return (
      <motion.div
        key={style.id}
        whileHover={{ scale: isLoaded ? 1.04 : 1 }}
        whileTap={{ scale: isLoaded ? 0.98 : 1 }}
        className={`cursor-pointer rounded-md overflow-hidden ${
          isActive
            ? "ring-2 ring-green-500"
            : isLoaded
            ? "hover:bg-green-100"
            : "opacity-50 cursor-wait"
        }`}
        onClick={() => isLoaded && handleStyleSelect(style.url)}
      >
        <div className='flex items-center gap-2'>
          <div
            className={`${
              isLargeScreen ? "h-24 w-full" : "h-16 w-16"
            } rounded-md overflow-hidden bg-gray-100 relative flex-shrink-0`}
          >
            {isLoaded && (
              <Map
                mapLib={maplibregl}
                viewState={viewState}
                style={{ width: "100%", height: "100%" }}
                mapStyle={style.url}
                interactive={false}
                attributionControl={false}
              />
            )}
            {!isLoaded && (
              <div className='absolute inset-0 bg-white/50 flex items-center justify-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent' />
              </div>
            )}
          </div>
          {!isLargeScreen && (
            <span className='text-gray-800 text-sm flex-1'>{style.name}</span>
          )}
          {isLargeScreen && (
            <span className='text-gray-800 text-xs mt-1 text-center truncate px-1'>
              {style.name}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className='absolute z-10 bottom-4 right-2 flex justify-center items-center'>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className='relative'
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={getPanelPosition()}
              style={{
                width: isLargeScreen ? "280px" : "auto",
                transformOrigin: isLargeScreen
                  ? "bottom right"
                  : "bottom center",
                maxHeight: isLargeScreen ? "auto" : "60vh",
              }}
            >
              <div className='flex justify-between items-center p-2 border-b border-gray-100'>
                <h3 className='text-gray-800 font-medium text-sm'>
                  Map Styles
                </h3>
                <button
                  onClick={togglePanel}
                  className='text-gray-400 hover:text-gray-600 transition-colors p-1'
                >
                  <FaTimes size={14} />
                </button>
              </div>
              <div className='p-2'>
                <div
                  className={`grid ${
                    isLargeScreen ? "grid-cols-2 gap-2" : "grid-cols-1 gap-1"
                  } max-h-[${
                    isLargeScreen ? "45vh" : "40vh"
                  }] p-2 overflow-y-auto`}
                >
                  {MAP_STYLES.map(renderMapStyleItem)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip
          title='Layers'
          placement='top'
          mouseEnterDelay={0.1}
          className='map-style-tooltip'
          open={isLargeScreen ? undefined : false}
        >
          <motion.button
            onClick={togglePanel}
            className={`relative group flex items-center justify-center w-8 h-8 rounded-md shadow-lg ${
              isOpen
                ? "bg-gradient-to-tr from-green-500 to-emerald-400 border-2 border-emerald-300"
                : "bg-white"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className='relative z-10 flex items-center justify-center w-full h-full'>
              <motion.div
                animate={{
                  scale: isOpen ? 1.2 : 1,
                  rotate: isOpen ? 0 : 360,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <FaLayerGroup
                  size={16}
                  className={isOpen ? "text-white" : "text-gray-800"}
                />
              </motion.div>
            </div>
          </motion.button>
        </Tooltip>
      </motion.div>
    </div>
  );
};

export default MapLayerSwitcher;
