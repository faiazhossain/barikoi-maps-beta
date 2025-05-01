// import React, { useEffect, useMemo, useState } from 'react';
// import { Drawer } from 'antd';
// import { RiExpandLeftFill, RiExpandRightFill } from 'react-icons/ri';
// import { motion } from 'framer-motion';
// import { useDispatch } from 'react-redux';
// import {
//   setDrawerDimensions,
//   toggleDrawer,
// } from '@/app/store/slices/drawerSlice';
// import { useAppSelector } from '@/app/store/store';
// import useWindowSize from '@/app/hooks/useWindowSize';
// import { MdExpandLess, MdOutlineCloseFullscreen } from 'react-icons/md';
// import DrawerContent from './DrawerContent/DrawerContent';

// // Constants
// const MOBILE_BREAKPOINT = 823;
// const MIN_DRAWER_HEIGHT = 300;
// const MAX_DRAWER_HEIGHT = '90vh';

// const LeftDrawer: React.FC = () => {
//   const dispatch = useDispatch();
//   const [startY, setStartY] = useState(0);
//   const [startHeight, setStartHeight] = useState(MIN_DRAWER_HEIGHT);
//   const [isDragging, setIsDragging] = useState(false);

//   // Redux state
//   const { isLeftBarOpen, placement, width, height } = useAppSelector(
//     (state) => state.drawer
//   );
//   const placeDetails = useAppSelector((state) => state.search.placeDetails);
//   const windowSize = useWindowSize();

//   // Responsive helpers
//   const isMobile = useMemo(
//     () => windowSize.width <= MOBILE_BREAKPOINT,
//     [windowSize.width]
//   );

//   // Set initial dimensions
//   useEffect(() => {
//     if (isMobile) {
//       dispatch(
//         setDrawerDimensions({
//           placement: 'bottom',
//           width: '100%',
//           height: MIN_DRAWER_HEIGHT,
//         })
//       );
//     } else {
//       dispatch(
//         setDrawerDimensions({
//           placement: 'left',
//           width: 432,
//           height: '100%',
//         })
//       );
//     }
//   }, [isMobile, dispatch]);

//   // Handle place details changes
//   useEffect(() => {
//     if (placeDetails && !isLeftBarOpen) {
//       dispatch(toggleDrawer());
//     }
//   }, [placeDetails, isLeftBarOpen, dispatch]);

//   // Drag handlers
//   const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
//     if (!isMobile) return;

//     setIsDragging(true);
//     const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
//     setStartY(clientY);
//     setStartHeight(typeof height === 'number' ? height : MIN_DRAWER_HEIGHT);
//   };

//   const handleDragMove = (e: MouseEvent | TouchEvent) => {
//     if (!isMobile || !isLeftBarOpen || !isDragging) return;

//     const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
//     const deltaY = startY - clientY;
//     let newHeight = startHeight + deltaY;

//     // Constrain height
//     newHeight = Math.max(MIN_DRAWER_HEIGHT, newHeight);
//     if (
//       typeof MAX_DRAWER_HEIGHT === 'string' &&
//       MAX_DRAWER_HEIGHT.endsWith('vh')
//     ) {
//       const maxVh = parseFloat(MAX_DRAWER_HEIGHT);
//       newHeight = Math.min(newHeight, (window.innerHeight * maxVh) / 100);
//     }

//     dispatch(setDrawerDimensions({ height: newHeight }));
//   };

//   const handleDragEnd = () => {
//     if (!isMobile || !isLeftBarOpen || !isDragging) return;

//     setIsDragging(false);
//     const currentHeight =
//       typeof height === 'number' ? height : MIN_DRAWER_HEIGHT;
//     const threshold = window.innerHeight * 0.6; // 60% of viewport height as threshold

//     dispatch(
//       setDrawerDimensions({
//         height:
//           currentHeight > threshold ? MAX_DRAWER_HEIGHT : MIN_DRAWER_HEIGHT,
//       })
//     );
//   };

//   // Add event listeners
//   useEffect(() => {
//     if (!isMobile) return;

//     window.addEventListener('touchmove', handleDragMove);
//     window.addEventListener('mousemove', handleDragMove);
//     window.addEventListener('touchend', handleDragEnd);
//     window.addEventListener('mouseup', handleDragEnd);

//     return () => {
//       window.removeEventListener('touchmove', handleDragMove);
//       window.removeEventListener('mousemove', handleDragMove);
//       window.removeEventListener('touchend', handleDragEnd);
//       window.removeEventListener('mouseup', handleDragEnd);
//     };
//   }, [isMobile, isLeftBarOpen, startY, startHeight, isDragging]);

//   // Toggle button
//   const toggleButton = useMemo(() => {
//     return isMobile ? (
//       <MdOutlineCloseFullscreen className='text-xl text-gray-600' />
//     ) : isLeftBarOpen ? (
//       <RiExpandLeftFill className='text-xl text-gray-600' />
//     ) : (
//       <RiExpandRightFill className='text-xl text-gray-600' />
//     );
//   }, [isMobile, isLeftBarOpen]);

//   // Drawer styles
//   const drawerStyles = useMemo(
//     () => ({
//       body: { padding: 0, height: '100%' },
//       content: {
//         boxShadow: isMobile
//           ? '0 -2px 8px rgba(0,0,0,0.15)'
//           : '2px 0 8px rgba(0,0,0,0.15)',
//         height: height,
//         overflow: 'hidden',
//         touchAction: 'none',
//       },
//     }),
//     [isMobile, height]
//   );

//   return (
//     <>
//       {/* Desktop toggle button - Always visible */}
//       {!isMobile && (
//         <motion.button
//           onClick={() => dispatch(toggleDrawer())}
//           className='fixed top-[50%] left-0 z-[1001] -translate-y-1/2 flex items-center justify-center w-8 h-16 bg-white !border-none rounded-r-md focus:outline-none'
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           style={{ x: isLeftBarOpen ? width : 0 }}
//           transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//         >
//           {toggleButton}
//         </motion.button>
//       )}

//       {/* Main drawer */}
//       <Drawer
//         placement={placement}
//         closable={false}
//         open={isLeftBarOpen}
//         width={width}
//         height={isMobile ? height : undefined}
//         styles={drawerStyles}
//         mask={false}
//       >
//         {/* Drag handle for mobile */}
//         {isMobile && (
//           <div
//             className='absolute top-0 left-0 right-0 h-8 flex justify-center items-center touch-none cursor-row-resize z-10'
//             onTouchStart={handleDragStart}
//             onMouseDown={handleDragStart}
//           >
//             <div className='w-12 h-1 bg-gray-300 rounded-full' />
//           </div>
//         )}

//         <div className='h-full overflow-x-hidden'>
//           <DrawerContent placeDetails={placeDetails} />
//         </div>
//       </Drawer>

//       {/* Mobile bottom toggle button */}
//       {isMobile && !isLeftBarOpen && (
//         <motion.button
//           onClick={() => dispatch(toggleDrawer())}
//           className='fixed bottom-10 left-0 right-0 mx-auto w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg'
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <MdExpandLess className='text-xl text-gray-600' />
//         </motion.button>
//       )}
//     </>
//   );
// };

// export default React.memo(LeftDrawer);
