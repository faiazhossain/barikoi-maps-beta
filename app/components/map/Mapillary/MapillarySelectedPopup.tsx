import React, { useState, useEffect } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import {
  FaImage,
  FaCalendarAlt,
  FaCompass,
  FaExpand,
  FaStreetView,
} from 'react-icons/fa';
import {
  MapillaryFeature,
  formatDate,
  fetchMapillaryImageData,
} from './MapillaryUtils';
import MapillaryJSViewer from './MapillaryJSViewer';
import Image from 'next/image';

interface MapillarySelectedPopupProps {
  feature: MapillaryFeature;
  onClose: () => void;
}

const MapillarySelectedPopup: React.FC<MapillarySelectedPopupProps> = ({
  feature,
  onClose,
}) => {
  const [showViewer, setShowViewer] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Fetch the image data when component mounts
  useEffect(() => {
    const fetchImageData = async () => {
      setImageLoaded(false);
      setImageError(false);

      try {
        const imageData = await fetchMapillaryImageData(feature.properties.id);
        if (imageData?.thumb_1024_url) {
          setThumbnailUrl(imageData.thumb_1024_url);
        } else {
          // If we didn't get thumbnail URLs, set error
          setImageError(true);
        }
      } catch (error) {
        console.error('Error fetching image data:', error);
        setImageError(true);
      }
    };

    fetchImageData();
  }, [feature.properties.id]);

  // Prevent event propagation on the popup
  const handlePopupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Open the interactive viewer
  const openViewer = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowViewer(true);
  };

  // Close the interactive viewer
  const closeViewer = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowViewer(false);
  };

  return (
    <>
      <Popup
        longitude={feature.coordinates[0]}
        latitude={feature.coordinates[1]}
        closeButton={true}
        closeOnClick={false}
        className='mapillary-popup-selected'
        offset={[0, -10]}
        anchor='bottom'
        onClose={onClose}
      >
        <div
          className='p-3 bg-white rounded-lg shadow-lg max-w-sm border border-orange-200'
          onClick={handlePopupClick}
        >
          <div className='flex items-center justify-between mb-2 border-b pb-2 border-gray-200'>
            <div className='flex items-center'>
              <FaImage className='text-orange-500 mr-2 text-lg' />
              <span className='font-medium'>Street View Photo</span>
            </div>
          </div>

          {/* Show thumbnail preview */}
          <div className='mb-3 relative rounded-md overflow-hidden'>
            <div
              className={`w-full h-36 bg-gray-100 ${
                !imageLoaded && !imageError && thumbnailUrl
                  ? 'animate-pulse'
                  : ''
              }`}
            >
              {thumbnailUrl && !imageError && (
                <Image
                  src={thumbnailUrl}
                  alt='Mapillary street view preview'
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  width={256}
                  height={144}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
              {!thumbnailUrl && !imageError && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-xs text-gray-500'>
                    Loading preview...
                  </span>
                </div>
              )}
              {imageError && (
                <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
                  <FaImage className='text-gray-400 text-2xl' />
                </div>
              )}
            </div>

            {/* View street view button overlay */}
            <button
              onClick={openViewer}
              className='absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1.5 rounded-full hover:bg-opacity-80 transition-colors'
              aria-label='Open street view'
            >
              <FaExpand size={14} />
            </button>
          </div>

          <div className='text-sm space-y-2.5'>
            <div className='flex items-center'>
              <FaCalendarAlt className='text-gray-500 mr-3 w-4' />
              <div>
                <div className='text-xs text-gray-500 mb-0.5'>Captured</div>
                <div className='text-gray-700'>
                  {formatDate(feature.properties.captured_at)}
                </div>
              </div>
            </div>

            {feature.properties.compass_angle && (
              <div className='flex items-center'>
                <FaCompass className='text-gray-500 mr-3 w-4' />
                <div>
                  <div className='text-xs text-gray-500 mb-0.5'>Direction</div>
                  <div className='text-gray-700'>
                    {Math.round(feature.properties.compass_angle)}°
                  </div>
                </div>
              </div>
            )}

            <div className='mt-3 pt-2 border-t border-gray-200'>
              <button
                onClick={openViewer}
                className='w-full flex items-center justify-center text-sm bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200'
              >
                <FaStreetView className='mr-2' /> Open Interactive Street View
              </button>
            </div>
          </div>
        </div>
      </Popup>

      {/* Interactive Mapillary.js viewer */}
      {showViewer && (
        <MapillaryJSViewer
          imageId={feature.properties.id}
          onClose={closeViewer}
        />
      )}
    </>
  );
};

export default MapillarySelectedPopup;
