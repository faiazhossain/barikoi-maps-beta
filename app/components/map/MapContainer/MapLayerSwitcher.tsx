"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "antd";
import { FaLayerGroup, FaTimes } from "react-icons/fa";
import { useAppSelector } from "@/app/store/store";
import Image from "next/image";

// Map style definitions with thumbnails, labels, and URLs
const MAP_STYLES = [
  {
    id: "default",
    name: "Light Style",
    url: "/map-styles/light-style.json",
    thumbnail: "/images/map-thumbnails/light-style.webp",
  },
  {
    id: "barikoi-green",
    name: "Barikoi Green",
    url: "https://map.barikoi.com/styles/barkoi_green/style.json?key=NDE2NzpVNzkyTE5UMUoy",
    thumbnail: "/images/map-thumbnails/barikoi-green.webp",
  },
  {
    id: "barikoi-dark",
    name: "Barikoi Dark",
    url: "https://map.barikoi.com/styles/barikoi-dark-mode/style.json?key=NDE2NzpVNzkyTE5UMUoy",
    thumbnail: "/images/map-thumbnails/barikoi-dark.webp",
  },
  {
    id: "planet-barikoi",
    name: "Planet Barikoi",
    url: "https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=NDE2NzpVNzkyTE5UMUoy",
    thumbnail: "/images/map-thumbnails/planet-barikoi.webp",
  },
  {
    id: "maptiler",
    name: "MapTiler Streets",
    url: "https://api.maptiler.com/maps/dfa2a215-243b-4b69-87ef-ce275b09249c/style.json?key=ASrfqapsZfy4BRFJJdVy",
    thumbnail: "/images/map-thumbnails/satellite-view.webp",
  },
];

// Map for fallback image backgrounds to represent different styles if thumbnails aren't available
const STYLE_COLORS = {
  default: "bg-gray-100",
  "barikoi-green": "bg-green-100",
  "barikoi-dark": "bg-gray-800",
  "planet-barikoi": "bg-blue-200",
  maptiler: "bg-amber-50",
};

interface MapLayerSwitcherProps {
  onStyleChange: (styleUrl: string) => void;
  currentStyleUrl: string;
}

const MapLayerSwitcher: React.FC<MapLayerSwitcherProps> = ({
  onStyleChange,
  currentStyleUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isLargeScreen = useAppSelector((state) => state.ui.isLargeScreen);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleStyleSelect = (styleUrl: string) => {
    onStyleChange(styleUrl);
    setIsOpen(false);
  };

  return (
    <div
      className={`absolute z-10 ${
        isLargeScreen ? "bottom-0" : "bottom-0"
      } right-2 flex justify-center items-center`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="relative"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-12 right-0 bg-white shadow-xl rounded-lg overflow-hidden"
              style={{ width: "320px", transformOrigin: "bottom right" }}
            >
              <div className="flex justify-between items-center p-3 border-b border-gray-100">
                <h3 className="text-gray-800 font-medium">Map Styles</h3>
                <button
                  onClick={togglePanel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                  {MAP_STYLES.map((style) => (
                    <motion.div
                      key={style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer rounded-lg ${
                        style.url === currentStyleUrl
                          ? "ring-2 ring-green-500 ring-offset-2"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleStyleSelect(style.url)}
                    >
                      <div className="flex flex-col">
                        <div className="h-24 rounded-lg overflow-hidden bg-gray-100 relative">
                          <div
                            className={`absolute inset-0 ${
                              STYLE_COLORS[
                                style.id as keyof typeof STYLE_COLORS
                              ]
                            }`}
                          />
                          <Image
                            src={style.thumbnail}
                            alt={style.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 150px) 100vw, 150px"
                            priority={style.id === "default"}
                          />
                          {style.url === currentStyleUrl && (
                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Active
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-gray-800 text-sm mt-2 text-center">
                          {style.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip
          title="Change Map Style"
          placement="left"
          mouseEnterDelay={0.1}
          className="map-style-tooltip"
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
            <div className="relative z-10 flex items-center justify-center w-full h-full">
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
