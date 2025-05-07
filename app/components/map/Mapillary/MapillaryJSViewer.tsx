import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Viewer as MapillaryViewer, ViewerOptions } from 'mapillary-js';
import { FaTimes, FaExpand, FaCompress } from 'react-icons/fa';
import { MAPILLARY_ACCESS_TOKEN } from './MapillaryUtils';

// You need to import the CSS in your _app.tsx or similar global file
// import 'mapillary-js/dist/mapillary.css';

interface MapillaryJSViewerProps {
  imageId: string;
  onClose: () => void;
}

const MapillaryJSViewer: React.FC<MapillaryJSViewerProps> = ({
  imageId,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<MapillaryViewer | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize viewer
  useEffect(() => {
    if (!containerRef.current) return;

    // Make sure CSS is loaded
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/mapillary-js@4.1.2/dist/mapillary.css';
    document.head.appendChild(cssLink);

    setIsLoading(true);

    const options: ViewerOptions = {
      accessToken: MAPILLARY_ACCESS_TOKEN,
      container: containerRef.current,
      imageId: imageId,
    };

    // Create and initialize the viewer
    const viewer = new MapillaryViewer(options);
    viewerRef.current = viewer;

    // Set up events
    const loadingHandler = () => {
      setIsLoading(false);
    };

    viewer.on('image', loadingHandler);

    // Clean up
    return () => {
      viewer.off('image', loadingHandler);
      viewer.remove();
      viewerRef.current = null;

      // Remove the CSS link
      if (document.head.contains(cssLink)) {
        document.head.removeChild(cssLink);
      }
    };
  }, [imageId]);

  // Toggle fullscreen
  const toggleFullScreen = () => {
    const newIsFullScreen = !isFullScreen;
    setIsFullScreen(newIsFullScreen);

    // Resize viewer
    if (viewerRef.current) {
      setTimeout(() => {
        viewerRef.current?.resize();
      }, 100); // Give the DOM time to update
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen, onClose]);

  return createPortal(
    <div
      className={`fixed inset-0 z-50 bg-black flex flex-col ${
        isFullScreen ? '' : 'p-4 md:p-8'
      }`}
    >
      {/* Toolbar */}
      <div className='flex justify-between items-center p-2 bg-black text-white z-10'>
        <div className='text-lg font-semibold ml-2'>Mapillary Street View</div>
        <div className='flex space-x-2'>
          <button
            onClick={toggleFullScreen}
            className='bg-gray-800 hover:bg-gray-700 p-2 rounded-full'
            title={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </button>
          <button
            onClick={onClose}
            className='bg-gray-800 hover:bg-gray-700 p-2 rounded-full'
            title='Close viewer'
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Viewer container */}
      <div className={`relative flex-grow ${isLoading ? 'bg-gray-900' : ''}`}>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-white text-lg'>Loading street view...</div>
          </div>
        )}
        <div ref={containerRef} className='w-full h-full' />
      </div>

      {/* Footer with instructions */}
      <div className='text-center text-sm text-gray-300 bg-black p-2'>
        Use mouse to navigate: drag to look around, scroll to zoom, double-click
        to move to another image
      </div>
    </div>,
    document.body
  );
};

export default MapillaryJSViewer;
