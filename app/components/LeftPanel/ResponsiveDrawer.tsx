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

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({
  defaultOpen = true,
}) => {
  const [width, height] = useWindowSize();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const controls = useAnimation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [drawerHeight, setDrawerHeight] = useState(300);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const placeDetails = useAppSelector((state) => state.search.placeDetails);

  const isMobile = width < MOBILE_BREAKPOINT;
  const isTab = width < TABLET_BREAKPOINT;

  const drawerWidth = useMemo(
    () => (isTab ? DRAWER_WIDTH_TABLET : DRAWER_WIDTH_DESKTOP),
    [isTab]
  );

  const contentHeight = useMemo(
    () => (isMobile ? drawerHeight - PADDING : height - PADDING),
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

  useEffect(() => {
    if (isMobile) {
      controls.start(isOpen ? 'open' : 'closed');
    } else {
      controls.start(isOpen ? 'open' : 'closed');
    }
  }, [isMobile, isOpen, controls]);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (isMobile) {
          controls.start(isOpen ? 'open' : 'closed');
        } else {
          controls.start(isOpen ? 'open' : 'closed');
        }
      }, 100);
    };

    handleResize();

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isMobile, isOpen, controls]);

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

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!isMobile) return;

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
    [isMobile, height, controls]
  );

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
        onDragEnd={isMobile ? handleDragEnd : undefined}
        dragElastic={isMobile ? 0.1 : 0}
        style={{
          ...(isMobile && { height: drawerHeight }),
          ...(!isMobile && {
            left: 0,
            top: 0,
            width: drawerWidth,
          }),
        }}
      >
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
          }}
        >
          <DrawerContent placeDetails={placeDetails} />
        </div>

        {isMobile && (
          <div className='absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full' />
        )}
      </motion.div>
    </>
  );
};

export default React.memo(ResponsiveDrawer);
