import React, { useState, useMemo } from "react";
import { FaHashtag, FaCopy, FaCheck } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface LocationMetaProps {
  placeDetails: {
    latitude?: number;
    longitude?: number;
    place_code?: string;
    [key: string]: any;
  };
}

const LocationMeta: React.FC<LocationMetaProps> = ({ placeDetails }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedType, setCopiedType] = useState<"coordinates" | "code" | null>(
    null
  );

  const coordinates = useMemo(() => {
    if (!placeDetails) return null;
    const lat = placeDetails.latitude;
    const lng = placeDetails.longitude;
    return lat && lng ? `${lat}, ${lng}` : null;
  }, [placeDetails]);

  const copyToClipboard = (text: string, type: "coordinates" | "code") => {
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setCopiedType(type);
      setTimeout(() => {
        setIsCopied(false);
        setCopiedType(null);
      }, 2000);
    }
  };

  if (!coordinates) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='px-3 py-2 bg-gray-50 rounded-lg border border-gray-50 text-sm text-gray-600'
    >
      <div className='flex flex-col gap-2'>
        {/* Coordinates */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FaMapMarkerAlt className='text-blue-500 text-sm' />
            <span className='font-medium'>Location:</span>
            <span className='font-mono text-xs'>{coordinates}</span>
          </div>
          <button
            onClick={() => copyToClipboard(coordinates, "coordinates")}
            className='text-gray-400 hover:text-blue-500 transition-colors'
            title='Copy coordinates'
          >
            {isCopied && copiedType === "coordinates" ? (
              <FaCheck className='text-green-500 text-xs' />
            ) : (
              <FaCopy className='w-3 h-3' />
            )}
          </button>
        </div>

        {/* Place code - only show if available */}
        {placeDetails.place_code && (
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FaHashtag className='text-blue-500 text-sm' />
              <span className='font-medium'>Code:</span>
              <span className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded'>
                {placeDetails.place_code}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(placeDetails.place_code!, "code")}
              className='text-gray-400 hover:text-blue-500 transition-colors'
              title='Copy place code'
            >
              {isCopied && copiedType === "code" ? (
                <FaCheck className='text-green-500 text-xs' />
              ) : (
                <FaCopy className='w-3 h-3' />
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LocationMeta;
