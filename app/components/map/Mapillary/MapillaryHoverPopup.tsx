import React, { useEffect, useState } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { FaImage } from 'react-icons/fa';
import { MapillaryFeature, fetchMapillaryImageData } from './MapillaryUtils';
import Image from 'next/image';

interface MapillaryHoverPopupProps {
  feature: MapillaryFeature;
}

const MapillaryHoverPopup: React.FC<MapillaryHoverPopupProps> = ({
  feature,
}) => {
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
        if (imageData?.thumb_256_url) {
          setThumbnailUrl(imageData.thumb_256_url);
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

  // Prevent event propagation
  const handlePopupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Popup
      longitude={feature.coordinates[0]}
      latitude={feature.coordinates[1]}
      closeButton={false}
      closeOnClick={false}
      className='mapillary-popup'
      offset={[0, -10]}
      anchor='bottom'
    >
      <div
        className='p-2 bg-white rounded-lg shadow-md max-w-xs border border-green-200'
        onClick={handlePopupClick}
      >
        <div className='flex items-center mb-1.5 border-b pb-1.5 border-gray-200'>
          <FaImage className='text-green-600 mr-2' />
          <span className='font-medium text-sm'>Street View Photo</span>
        </div>

        {/* Image thumbnail preview */}
        <div
          className={`w-full h-24 bg-gray-100 rounded overflow-hidden mb-2 relative ${
            !imageLoaded && !imageError && thumbnailUrl ? 'animate-pulse' : ''
          }`}
        >
          {thumbnailUrl && !imageError && (
            <Image
              src={thumbnailUrl}
              alt='Street view preview'
              width={256}
              height={144}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          {!thumbnailUrl && !imageError && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-xs text-gray-500'>Loading preview...</span>
            </div>
          )}
          {imageError && (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
              <FaImage className='text-gray-400 text-2xl' />
            </div>
          )}
        </div>

        <div className='text-xs space-y-1.5'>
          <div className='mt-1.5 text-xs text-gray-500 text-center'>
            Click to view full street view
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default MapillaryHoverPopup;
