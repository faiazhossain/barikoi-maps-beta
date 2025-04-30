import React, { useEffect, useMemo, useCallback } from 'react';
import { Drawer } from 'antd';
import { RiExpandLeftFill, RiExpandRightFill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import {
  toggleDrawer,
  setDrawerDimensions,
  closeDrawer,
  openDrawer,
} from '@/app/store/slices/drawerSlice';
import { useAppSelector } from '@/app/store/store';
import useWindowSize from '@/app/hooks/useWindowSize';
import {
  MdExpandLess,
  MdExpandMore,
  MdOutlineCloseFullscreen,
} from 'react-icons/md';
import DrawerContent from './DrawerContent/DrawerContent';

import { TbMinimize } from 'react-icons/tb';

// Constants for responsive breakpoints
const MOBILE_BREAKPOINT = 823;
const TAB_BREAKPOINT = 1023;

const LeftDrawer: React.FC = () => {
  const dispatch = useDispatch();

  // Redux state selectors
  const { isOpen, placement, width, height, isExpanded } = useAppSelector(
    (state) => state.drawer
  );

  const placeDetails = useAppSelector((state) => state.search.placeDetails);
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);
  const windowSize = useWindowSize();

  // ====================== Responsive Helpers ======================
  const isMobile = useMemo(
    () => windowSize.width <= MOBILE_BREAKPOINT,
    [windowSize.width]
  );
  const isTab = useMemo(
    () => windowSize.width <= TAB_BREAKPOINT,
    [windowSize.width]
  );

  // ====================== Effects ======================
  // Handle initial dimensions and responsive changes
  useEffect(() => {
    if (isMobile) {
      dispatch(
        setDrawerDimensions({
          placement: 'bottom',
          width: '100%',
          height: 300,
          isExpanded: false,
        })
      );
    } else if (isTab) {
      dispatch(
        setDrawerDimensions({
          placement: 'left',
          width: 400,
          isExpanded: false,
        })
      );
    } else {
      dispatch(
        setDrawerDimensions({
          placement: 'left',
          width: 432,
          height: '100%',
          isExpanded: true,
        })
      );
    }
  }, [isMobile, isTab, dispatch]);

  useEffect(() => {
    if (placeDetails) {
      dispatch(openDrawer());
      if (isMobile) {
        dispatch(
          setDrawerDimensions({
            placement: 'bottom',
            width: '100%',
            height: 300,
            isExpanded: false,
          })
        );
      }
    }
  }, [placeDetails, dispatch, isMobile]);

  // ====================== Event Handlers ======================
  const handleToggle = useCallback(() => {
    if (isMobile && !isOpen) {
      dispatch(
        setDrawerDimensions({
          height: 300,
          isExpanded: false,
        })
      );
    }
    dispatch(toggleDrawer());
  }, [isMobile, isOpen, dispatch]);

  const toggleExpand = useCallback(() => {
    if (isMobile) {
      dispatch(
        setDrawerDimensions({
          height: isExpanded ? 300 : '100dvh',
          isExpanded: !isExpanded,
        })
      );
    }
  }, [isMobile, isExpanded, dispatch]);

  const toggleMinimize = useCallback(() => {
    if (isMobile && isOpen) {
      dispatch(closeDrawer());
    }
  }, [isMobile, isOpen, dispatch]);

  // ====================== UI Components ======================
  // Toggle button based on device type and state
  const toggleButton = useMemo(() => {
    if (isMobile) {
      return isOpen ? (
        <MdOutlineCloseFullscreen className='text-xl text-gray-600' />
      ) : (
        <MdExpandLess className='text-xl text-gray-600' />
      );
    }
    return isOpen ? (
      <RiExpandLeftFill className='text-xl text-gray-600' />
    ) : (
      <RiExpandRightFill className='text-xl text-gray-600' />
    );
  }, [isMobile, isOpen]);

  // Mobile minimize button (only visible when expanded on mobile)
  const mobileMinimizeButton = useMemo(() => {
    if (!isMobile || !isOpen) return null;

    return (
      <button
        onClick={toggleMinimize}
        className='absolute top-0 right-2 z-10 p-1'
        aria-label='Minimize drawer'
      >
        <TbMinimize className='text-xl text-gray-600 hover:text-green-600' />
      </button>
    );
  }, [isMobile, isOpen, toggleMinimize]);

  // Mobile expand button (only visible on mobile)
  const mobileExpandButton = useMemo(() => {
    if (!isMobile) return null;

    return (
      <div className='absolute top-0 w-8 h-8 mx-auto left-0 right-0 flex justify-center p-2 bg-none'>
        <button
          onClick={toggleExpand}
          className='flex items-center justify-center w-full py-2'
        >
          {isExpanded ? (
            <MdExpandMore className='text-xl' />
          ) : (
            <MdExpandLess className='text-xl' />
          )}
        </button>
      </div>
    );
  }, [isMobile, isExpanded, toggleExpand]);

  // Desktop toggle button (only visible on desktop/tablet)
  const desktopToggleButton = useMemo(() => {
    if (isMobile) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: isOpen ? width : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className='fixed top-[50%] left-0 z-[1001] -translate-y-1/2'
        >
          <motion.button
            onClick={handleToggle}
            className='flex items-center justify-center w-8 h-16 bg-white !border-none rounded-r-md focus:outline-none'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {toggleButton}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    );
  }, [isMobile, isOpen, width, handleToggle, toggleButton]);

  // Mobile bottom toggle button (only visible when drawer is closed on mobile)
  const mobileBottomToggleButton = useMemo(() => {
    if (!isMobile || isOpen) return null;

    return (
      <motion.button
        onClick={handleToggle}
        className='absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-white'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {toggleButton}
      </motion.button>
    );
  }, [isMobile, isOpen, handleToggle, toggleButton]);

  // ====================== Styles ======================
  // Drawer styles based on device type
  const drawerStyles = useMemo(() => {
    if (isMobile) {
      return {
        body: { padding: 0, height: '100%' },
        wrapper: { position: 'absolute' as const },
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
      wrapper: { position: 'absolute' as const },
      content: {
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        height: '100dvh',
      },
      header: { padding: '16px' },
    };
  }, [isMobile, isVisible, height]);

  // ====================== Main Render ======================
  return (
    <>
      {desktopToggleButton}

      <Drawer
        placement={placement}
        closable={false}
        onClose={handleToggle}
        open={isOpen}
        key={placement}
        mask={false}
        width={width}
        height={isMobile ? height : undefined}
        styles={drawerStyles}
      >
        <div className='h-full overflow-x-hidden leftbar-container'>
          {mobileMinimizeButton}
          <DrawerContent placeDetails={placeDetails} />
          {mobileExpandButton}
        </div>
      </Drawer>

      {mobileBottomToggleButton}
    </>
  );
};

export default React.memo(LeftDrawer);
