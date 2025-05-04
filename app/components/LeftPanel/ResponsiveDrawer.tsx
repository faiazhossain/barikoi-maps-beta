'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useWindowSize } from '@react-hook/window-size';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import DrawerContent from './DrawerContent/DrawerContent';
import { useAppSelector } from '@/app/store/store';

interface ResponsiveDrawerProps {
  defaultOpen?: boolean;
}

const MOBILE_BREAKPOINT = 824;
const TABLET_BREAKPOINT = 1024;
const DRAWER_WIDTH_TABLET = 400;
const DRAWER_WIDTH_DESKTOP = 432;
const BUTTON_HEIGHT = 48;
const PADDING = 48;
const INITIAL_DRAWER_HEIGHT = 300;

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({
  defaultOpen = true,
}) => {
  const [width, height] = useWindowSize();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const controls = useAnimation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [drawerHeight, setDrawerHeight] = useState(INITIAL_DRAWER_HEIGHT);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const { placeDetails } = useAppSelector((state) => state.search);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartTimeRef = useRef<number>(0);
  const dragThresholdTime = 300; // 2 seconds threshold for intentional drag
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1 for progress
  const dragTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isMobile = width < MOBILE_BREAKPOINT;
  const isTab = width < TABLET_BREAKPOINT;

  const drawerWidth = useMemo(
    () => (isTab ? DRAWER_WIDTH_TABLET : DRAWER_WIDTH_DESKTOP),
    [isTab]
  );

  const contentHeight = useMemo(
    () => (isMobile ? drawerHeight - PADDING : height),
    [isMobile, drawerHeight, height]
  );

  const variants = useMemo(
    () => ({
      desktop: {
        open: {
          x: 0,
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
        closed: {
          x: -drawerWidth,
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
      },
      mobile: {
        open: {
          y: height - drawerHeight,
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
        closed: {
          y: height,
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
      },
    }),
    [drawerWidth, height, drawerHeight]
  );

  // Reset drawer height when switching between mobile and desktop
  useEffect(() => {
    if (!isMobile) {
      setDrawerHeight(height); // Reset to full height when not mobile
    } else {
      // When switching to mobile, use either the previous mobile height or initial height
      setDrawerHeight((prev) =>
        prev === height ? INITIAL_DRAWER_HEIGHT : prev
      );
    }
  }, [isMobile, height]);

  useEffect(() => {
    controls.start(isOpen ? 'open' : 'closed');
  }, [isMobile, isOpen, controls]);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        controls.start(isOpen ? 'open' : 'closed');
      }, 100);
    };

    handleResize();

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isMobile, isOpen, controls]);
  // Add this useEffect hook to your component
  useEffect(() => {
    // Open the drawer whenever placeDetails changes
    if (placeDetails) {
      setIsOpen(true);
      controls.start(isMobile ? 'open' : 'open'); // Use the appropriate variant
    }
  }, [placeDetails, isMobile, controls]);

  // Also modify your existing useEffect for initial state
  useEffect(() => {
    // Only set initial closed state if there's no placeDetails
    if (!placeDetails) {
      controls.start(isOpen ? 'open' : 'closed');
    }
  }, [isMobile, isOpen, controls, placeDetails]);

  const toggleDrawer = useCallback(() => {
    if (isMobile) {
      const newY = isOpen ? height : height - drawerHeight;
      controls.start({ y: newY }).then(() => {
        setIsOpen(!isOpen);
      });
    } else {
      const newState = !isOpen;
      setIsOpen(newState);
      controls.start(newState ? 'open' : 'closed');
    }
  }, [isMobile, height, drawerHeight, controls, isOpen]);

  const handleDragStart = useCallback(() => {
    if (!isMobile) return;

    dragStartTimeRef.current = Date.now();
    setIsDragging(true);
    setDragProgress(0);

    // Start a timer to update progress
    if (dragTimerRef.current) {
      clearInterval(dragTimerRef.current);
    }

    dragTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - dragStartTimeRef.current;
      const progress = Math.min(elapsed / dragThresholdTime, 1);
      setDragProgress(progress);

      if (progress >= 1 && dragTimerRef.current) {
        clearInterval(dragTimerRef.current);
      }
    }, 50);
  }, [isMobile]);

  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!isMobile || !isDragging) return;

      // Check if we've been dragging long enough to consider it intentional
      const dragDuration = Date.now() - dragStartTimeRef.current;
      if (dragDuration < dragThresholdTime) {
        return; // Ignore short drags
      }

      // Only update position during intentional drag
      const currentY = info.point.y;
      if (currentY > 0 && currentY < height) {
        controls.set({ y: currentY });
      }
    },
    [isMobile, isDragging, height, controls]
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!isMobile) return;

      // Clear the progress update timer
      if (dragTimerRef.current) {
        clearInterval(dragTimerRef.current);
        dragTimerRef.current = null;
      }

      const dragDuration = Date.now() - dragStartTimeRef.current;
      setIsDragging(false);
      setDragProgress(0); // Reset progress

      // Only process as drawer resize if it's been dragged for longer than threshold
      if (dragDuration < dragThresholdTime) {
        // Return to original position if not held long enough
        controls.start(isOpen ? 'open' : 'closed');
        return;
      }

      const currentY = info.point.y;
      const threshold = height / 3;

      if (currentY > height - threshold) {
        controls.start({ y: height }).then(() => {
          setIsOpen(false);
        });
      } else if (currentY < threshold) {
        setDrawerHeight(height - 50);
        controls.start({ y: 50 }).then(() => {
          setIsOpen(true);
        });
      } else {
        const newHeight = height - currentY;
        setDrawerHeight(newHeight);
        controls.start({ y: currentY }).then(() => {
          setIsOpen(true);
        });
      }
    },
    [isMobile, height, controls, isOpen]
  );

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (dragTimerRef.current) {
        clearInterval(dragTimerRef.current);
      }
    };
  }, []);

  const buttonStyle = useMemo(
    () =>
      isMobile
        ? {
            left: '50%',
            transform: 'translateX(-50%)',
            top: '-36px',
            width: `${BUTTON_HEIGHT}px`,
            borderRadius: '10px 10px 0 0',
          }
        : {
            right: '-26px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: `${BUTTON_HEIGHT}px`,
            borderRadius: '0 10px 10px 0',
          },
    [isMobile]
  );

  return (
    <>
      {isMobile && isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-20'
          onClick={toggleDrawer}
        />
      )}

      <motion.div
        ref={drawerRef}
        className={`fixed z-20 bg-white shadow-xl ${
          isMobile ? 'w-full rounded-t-2xl' : 'h-full'
        }`}
        initial={false}
        animate={controls}
        variants={isMobile ? variants.mobile : variants.desktop}
        drag={isMobile ? 'y' : false}
        dragConstraints={isMobile ? { top: 0, bottom: height } : undefined}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        dragElastic={isMobile ? 0.1 : 0}
        style={{
          ...(isMobile && { height: drawerHeight }),
          ...(!isMobile && {
            left: 0,
            top: 0,
            width: drawerWidth,
            height: '100%', // Ensure full height in desktop mode
          }),
        }}
      >
        {/* Drag handle for mobile with progress indicator */}
        {isMobile && (
          <div
            className='absolute top-0 left-0 w-full h-10 cursor-grab active:cursor-grabbing'
            style={{ touchAction: 'none' }}
          >
            <div className='absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full bg-gray-300 overflow-hidden'>
              <div
                className='absolute top-0 left-0 h-full rounded-full transition-all duration-100 ease-linear'
                style={{
                  width: `${dragProgress * 100}%`,
                  backgroundColor: dragProgress >= 1 ? '#10B981' : '#60A5FA',
                }}
              />
            </div>
          </div>
        )}

        <button
          onClick={toggleDrawer}
          className='absolute z-30 p-2 bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors'
          style={buttonStyle}
          aria-label={isOpen ? 'Close drawer' : 'Open drawer'}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        <div
          className='h-full overflow-y-auto overflow-x-hidden'
          style={{
            height: contentHeight,
            ...(isMobile && { paddingTop: '10px' }), // Add padding for drag handle
          }}
        >
          <div
            className='h-full overflow-y-auto overflow-x-hidden'
            style={{
              height: contentHeight,
            }}
          >
            <DrawerContent />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default React.memo(ResponsiveDrawer);
