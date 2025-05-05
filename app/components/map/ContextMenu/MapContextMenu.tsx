import React, { useState } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import {
  FaMapMarkerAlt,
  FaSearch,
  FaRoute,
  FaShareAlt,
  FaCopy,
  FaCheck,
  FaInfoCircle,
} from 'react-icons/fa';
import { MdDirections } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/store/store';
import { closeDrawer, openLeftBar } from '@/app/store/slices/drawerSlice';
import { fetchReverseGeocode } from '@/app/store/thunks/searchThunks';
import { setMarkerCoords, setViewport } from '@/app/store/slices/mapSlice';
import { setSelectedCategories } from '@/app/store/slices/searchSlice';

interface MapContextMenuProps {
  longitude: number;
  latitude: number;
  onClose: () => void;
}

const MapContextMenu: React.FC<MapContextMenuProps> = ({
  longitude,
  latitude,
  onClose,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);

  // Format coordinates to 6 decimal places
  const lat = latitude.toFixed(6);
  const lng = longitude.toFixed(6);
  const coordsText = `${lat}, ${lng}`;

  const handleCopyCoords = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coordsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowInfo = () => {
    // Use Redux action to set marker coordinates
    dispatch(
      setMarkerCoords({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        properties: {
          source: 'contextMenu',
        },
      })
    );

    dispatch(
      fetchReverseGeocode({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      })
    )
      .unwrap()
      .then(() => {
        dispatch(openLeftBar());
      });
    onClose();
  };

  const handleSearchNearby = () => {
    dispatch(
      setViewport({
        latitude: latitude,
        longitude: longitude,
        zoom: 16, // Good zoom level for nearby places
      })
    );

    // Determine a relevant category based on the place type
    const category = 'Restaurant'; // Default category

    // Set the selected category to trigger nearby search
    dispatch(setSelectedCategories([category]));

    // Close the drawer to show the map and nearby results
    dispatch(closeDrawer());
    onClose();
  };

  const handleDirectionsFrom = () => {
    router.push(`/directions?from=${lat},${lng}`);
    onClose();
  };

  const handleDirectionsTo = () => {
    router.push(`/directions?to=${lat},${lng}`);
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Location on Barikoi Maps',
          text: `Check out this location at ${lat}, ${lng}`,
          url: `${window.location.origin}/#${lat},${lng}`,
        })
        .catch(console.error);
    } else {
      const url = `${window.location.origin}/#${lat},${lng}`;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    }
    onClose();
  };

  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      closeButton={false}
      closeOnClick={false}
      className='context-menu-popup'
      anchor='top'
      offset={[120, 3]}
    >
      <div className='bg-white shadow-md w-[240px] overflow-hidden'>
        {/* Compact header with coordinates */}
        <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-2 text-white'>
          <div className='flex items-center justify-between mb-1'>
            <div className='flex items-center gap-1'>
              <FaMapMarkerAlt className='text-white text-sm' />
              <span className='text-sm font-medium'>Location</span>
            </div>
            <button
              className='text-xs bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded flex items-center gap-1'
              onClick={handleCopyCoords}
            >
              {copied ? <FaCheck size={10} /> : <FaCopy size={10} />}
              <span className='text-xs'>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className='flex items-center'>
            <code className='text-xs bg-black/20 px-1.5 py-0.5 rounded w-full overflow-x-auto whitespace-nowrap'>
              {coordsText}
            </code>
          </div>
        </div>

        {/* Action buttons in a compact grid */}
        <div className='p-1.5'>
          <div className='grid grid-cols-3 gap-1'>
            <button
              className='flex flex-col items-center justify-center p-1.5 text-xs hover:bg-gray-100 rounded-md transition-colors'
              onClick={handleShowInfo}
              title='Show information'
            >
              <FaInfoCircle className='text-green-600 mb-1' size={16} />
              <span className='text-[10px]'>Info</span>
            </button>
            <button
              className='flex flex-col items-center justify-center p-1.5 text-xs hover:bg-gray-100 rounded-md transition-colors'
              onClick={handleSearchNearby}
              title='Search nearby'
            >
              <FaSearch className='text-amber-600 mb-1' size={16} />
              <span className='text-[10px]'>Nearby</span>
            </button>
            <button
              className='flex flex-col items-center justify-center p-1.5 text-xs hover:bg-gray-100 rounded-md transition-colors'
              onClick={handleShare}
              title='Share location'
            >
              <FaShareAlt className='text-purple-600 mb-1' size={16} />
              <span className='text-[10px]'>Share</span>
            </button>
            <button
              className='flex flex-col items-center justify-center p-1.5 text-xs hover:bg-gray-100 rounded-md transition-colors'
              onClick={handleDirectionsFrom}
              title='Directions from here'
            >
              <MdDirections className='text-red-600 mb-1' size={16} />
              <span className='text-[10px]'>From here</span>
            </button>
            <button
              className='flex flex-col items-center justify-center p-1.5 text-xs hover:bg-gray-100 rounded-md transition-colors'
              onClick={handleDirectionsTo}
              title='Directions to here'
            >
              <FaRoute className='text-indigo-600 mb-1' size={16} />
              <span className='text-[10px]'>To here</span>
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default MapContextMenu;
