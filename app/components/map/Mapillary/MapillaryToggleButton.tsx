import React from "react";
import { FaStreetView } from "react-icons/fa";
import { motion } from "framer-motion";
import { Tooltip } from "antd";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { toggleMapillaryLayer } from "@/app/store/slices/mapillarySlice";

const MapillaryToggleButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector((state) => state.mapillary.isVisible);
  const isLargeScreen = useAppSelector((state) => state.ui.isLargeScreen);

  const handleToggle = () => {
    dispatch(toggleMapillaryLayer());
  };

  return (
    <div
      className={`absolute z-10 ${
        isLargeScreen ? "bottom-14" : "bottom-14"
      } right-2`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <Tooltip
          title={isVisible ? "Hide Street View" : "Show Street View"}
          placement='left'
          mouseEnterDelay={0.1}
          className='mapillary-tooltip'
          open={isLargeScreen ? undefined : false} // Only show on large screens
        >
          <motion.button
            onClick={handleToggle}
            aria-label={isVisible ? "Hide Street View" : "Show Street View"}
            className={`relative group flex items-center justify-center w-8 h-8 rounded-md shadow-xl ${
              isVisible
                ? "bg-gradient-to-tr from-green-500 to-emerald-400 border-2 border-emerald-300"
                : "bg-white"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className='absolute inset-0 rounded-md bg-white bg-opacity-30 blur-sm'></div>
            <div className='relative z-10 flex items-center justify-center w-full h-full'>
              <motion.div
                animate={{
                  rotate: isVisible ? [0, 360] : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <FaStreetView
                  className={`text-xl ${
                    isVisible ? "text-black" : "text-gray-800"
                  }`}
                />
              </motion.div>
            </div>

            {/* Animated ring */}
            {isVisible && (
              <motion.div
                className='absolute inset-0 rounded-full'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 1.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeOut",
                }}
              >
                <div className='w-full h-full rounded-full border-4 border-green-400 bg-transparent'></div>
              </motion.div>
            )}
          </motion.button>
        </Tooltip>
      </motion.div>
    </div>
  );
};

export default MapillaryToggleButton;
