import React, { useState } from "react";
import {
  FaCopy,
  FaMapMarkerAlt,
  FaCheck,
  FaBuilding,
  FaRoad,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { BsMailbox2Flag, BsGeoAlt } from "react-icons/bs";
import { Tooltip } from "antd";

interface AddressSectionProps {
  address: string;
  postcode?: string;
  holdingNumber?: string;
  roadNameNumber?: string;
  area?: string;
  city?: string;
  business_name?: string;
  place_name?: string;
  sub_area?: string;
}

export const AddressSection = ({
  address,
  postcode,
  holdingNumber,
  roadNameNumber,
  area,
  city,
  business_name,
  place_name,
  sub_area,
}: AddressSectionProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy address: ", err);
      });
  };

  const hasDetails =
    holdingNumber || roadNameNumber || sub_area || area || city;

  return (
    <motion.div
      className='p-5 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer relative rounded-lg'
      onClick={copyToClipboard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className='flex justify-between items-center mb-4'>
        <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-800'>
          <FaMapMarkerAlt className='text-red-500 text-xl' />
          Address
        </h3>

        <motion.button
          className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${
            isCopied
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } transition-colors`}
          title='Copy address to clipboard'
          aria-label={
            isCopied
              ? "Address copied to clipboard"
              : "Copy address to clipboard"
          }
          disabled={isCopied}
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 10 }}
          animate={{
            opacity: isHovered || isCopied ? 1 : 0,
            x: isHovered || isCopied ? 0 : 10,
          }}
        >
          {isCopied ? (
            <>
              <FaCheck className='text-green-600' />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <FaCopy />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      <div className='space-y-3'>
        {/* Full address - Highlighted with larger font and special styling */}
        <p className='text-gray-800 text-[17px] leading-relaxed font-medium border-l-4 border-green-500 pl-3 py-1 bg-green-50/50 rounded-r-md'>
          {address}
        </p>

        {/* Address components with better spacing */}
        {hasDetails && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4'>
            {(place_name || business_name) && (
              <div className='flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md'>
                <FaBuilding className='text-gray-500 min-w-[16px]' />
                <span className='truncate'>{place_name || business_name}</span>
              </div>
            )}

            {holdingNumber && (
              <div className='flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md'>
                <BsGeoAlt className='text-gray-500 min-w-[16px]' />
                <span className='truncate'>House: {holdingNumber}</span>
              </div>
            )}

            {roadNameNumber && (
              <div className='flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md'>
                <FaRoad className='text-gray-500 min-w-[16px]' />
                <span className='truncate'>{roadNameNumber}</span>
              </div>
            )}
          </div>
        )}

        {/* Postal code and area badges with improved spacing */}
        <div className='flex flex-wrap items-center gap-2 mt-4'>
          {postcode && (
            <Tooltip
              title='Postal/Zip Code'
              placement='top'
              color='#2f855a'
              className='text-xs'
            >
              <div className='inline-flex items-center bg-green-50 rounded-full px-3 py-1.5 border border-green-200 shadow-sm hover:bg-green-100 transition-colors'>
                <BsMailbox2Flag className='text-sm text-green-600 mr-2' />
                <span className='text-xs font-bold text-green-800'>
                  {postcode}
                </span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </motion.div>
  );
};
