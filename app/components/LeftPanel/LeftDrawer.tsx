import React, { useEffect } from 'react';
import { Drawer } from 'antd';
import { RiExpandLeftFill, RiExpandRightFill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleDrawer,
  setDrawerDimensions,
} from '@/app/store/slices/drawerSlice';
import { useAppSelector, type RootState } from '@/app/store/store';
import useWindowSize from '@/app/hooks/useWindowSize';
import {
  MdExpandLess,
  MdExpandMore,
  MdOutlineCloseFullscreen,
} from 'react-icons/md';

const MOBILE_BREAKPOINT = 823;

const LeftDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, placement, width, height, isExpanded } = useSelector(
    (state: RootState) => state.drawer
  );
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= MOBILE_BREAKPOINT;
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);

  useEffect(() => {
    // Set initial dimensions based on screen size
    if (isMobile) {
      dispatch(
        setDrawerDimensions({
          placement: 'bottom',
          width: '100%',
          height: 300, // Default height for mobile
          isExpanded: false,
        })
      );
    } else {
      dispatch(
        setDrawerDimensions({
          placement: 'left',
          width: 400,
          height: '100%',
          isExpanded: true,
        })
      );
    }
  }, [isMobile, dispatch]);

  const handleToggle = () => {
    if (isMobile && !isOpen) {
      // When opening on mobile, ensure it starts at 300px
      dispatch(
        setDrawerDimensions({
          height: 300,
          isExpanded: false,
        })
      );
    }
    dispatch(toggleDrawer());
  };

  const toggleExpand = () => {
    if (isMobile) {
      dispatch(
        setDrawerDimensions({
          height: isExpanded ? 300 : '100dvh', // Toggle between 300px and full height
          isExpanded: !isExpanded,
        })
      );
    }
  };

  const getToggleButton = () => {
    if (isMobile) {
      return isOpen ? (
        <MdOutlineCloseFullscreen className="text-xl text-gray-600" />
      ) : (
        <MdExpandLess className="text-xl text-gray-600" />
      );
    }
    return isOpen ? (
      <RiExpandLeftFill className="text-xl text-gray-600" />
    ) : (
      <RiExpandRightFill className="text-xl text-gray-600" />
    );
  };

  const getDrawerStyles = () => {
    if (isMobile) {
      return {
        body: { padding: 0, height: '100%' },
        wrapper: { position: 'absolute' as 'absolute' },
        content: {
          boxShadow: isVisible ? 'none' : '0 -2px 8px rgba(0,0,0,0.15)',
          height: height,
          overflow: 'hidden',
        },
        header: { padding: '16px' },
      };
    }
    return {
      body: { padding: 0 },
      wrapper: { position: 'absolute' as 'absolute' },
      content: {
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        height: '100dvh',
      },
      header: { padding: '16px' },
    };
  };

  return (
    <>
      <AnimatePresence>
        {!isMobile && (
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: isOpen ? width : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-[50%] left-0 z-[1001] -translate-y-1/2"
          >
            <motion.button
              onClick={handleToggle}
              className="flex items-center justify-center w-8 h-16 bg-white !border-none rounded-r-md focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {getToggleButton()}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span>Map Data Panel</span>
            {isMobile && (
              <motion.button
                onClick={handleToggle}
                className="p-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {getToggleButton()}
              </motion.button>
            )}
          </div>
        }
        placement={placement}
        closable={false}
        onClose={handleToggle}
        open={isOpen}
        key={placement}
        mask={false}
        width={width}
        height={isMobile ? height : undefined}
        styles={getDrawerStyles()}
      >
        <div className="p-4 h-full overflow-y-auto">
          {/* Your data content here */}
          <p>Map data point 1</p>
          <p>Map data point 2</p>
          <p>Map data point 3</p>

          {/* Mobile expand/collapse button at bottom */}
          {isMobile && (
            <div
              className={`absolute top-0 w-8 h-8 mx-auto left-0 right-0 flex justify-center p-2 bg-none`}
            >
              <button
                onClick={toggleExpand}
                className="flex items-center justify-center w-full py-2"
              >
                {isExpanded ? (
                  <MdExpandMore className="text-xl" />
                ) : (
                  <MdExpandLess className="text-xl" />
                )}
              </button>
            </div>
          )}
        </div>
      </Drawer>

      {/* Mobile toggle button */}
      {isMobile && !isOpen && (
        <motion.button
          onClick={handleToggle}
          className="absolute bottom-0 left-0 right-0 flex justify-center p-2 bg-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {getToggleButton()}
        </motion.button>
      )}
    </>
  );
};

export default LeftDrawer;
