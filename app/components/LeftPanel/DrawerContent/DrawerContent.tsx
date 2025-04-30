// DrawerContent.tsx
import React, { useMemo } from 'react';
import { useAppSelector } from '@/app/store/store';

import { PlaceHeader } from './components/PlaceHeader';
import { ActionButtons } from './components/ActionButtons';
import { AddressSection } from './components/AddressSection';
import { ContactInfo } from './components/ContactInfo';
import { AdditionalInfo } from './components/AdditionalInfo';
import ImageCarousel from './components/ImageCarousel';
import useWindowSize from '@/app/hooks/useWindowSize';
import { Skeleton } from 'antd';

interface ContactInfoData {
  name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
}
const MOBILE_BREAKPOINT = 823;
const DrawerContent = ({ placeDetails }) => {
  const windowSize = useWindowSize();

  // ====================== Responsive Helpers ======================
  const isMobile = useMemo(
    () => windowSize.width <= MOBILE_BREAKPOINT,
    [windowSize.width]
  );
  const isLoading = useAppSelector((state) => state.search.placeDetailsLoading);
  const contact: ContactInfoData =
    placeDetails?.places_additional_data?.[0]?.contact || {};

  if (isLoading) {
    return (
      <div className='p-4 flex flex-col justify-center items-center h-full min-h-[300px]'>
        {/* Floating card with shimmer border */}
        <div className='relative w-64 h-40 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent animate-border-pulse'>
          {/* Card content skeleton */}
          <div className='p-4 h-full flex flex-col'>
            {/* Animated avatar placeholder */}
            <div className='flex items-center space-x-3 mb-3'>
              <div className='w-10 h-10 rounded-full bg-gradient-to-r from-amber-200 to-rose-300 animate-pulse'></div>
              <div className='space-y-2'>
                <div className='h-3 w-24 bg-gray-200 rounded animate-pulse'></div>
                <div className='h-2 w-16 bg-gray-100 rounded animate-pulse'></div>
              </div>
            </div>

            {/* Typing animation */}
            <div className='flex-1 flex items-center'>
              <div className='relative w-full'>
                <div className='absolute left-0 top-0 h-4 w-full bg-gray-100 rounded'></div>
                <div className='absolute left-0 top-0 h-4 w-0 bg-blue-400 rounded animate-typing'></div>
                <div className='absolute left-0 top-0 h-4 w-2 bg-white animate-caret-blink'></div>
              </div>
            </div>

            {/* Floating emojis */}
            <div className='absolute -top-3 -right-3 text-2xl animate-float'>
              ✨
            </div>
            <div className='absolute -bottom-2 -left-2 text-xl animate-float-delay'>
              🦄
            </div>
          </div>
        </div>

        {/* Fun loading message with changing words */}
        <div className='mt-6 text-gray-500 text-sm'>
          <span className='inline-block min-w-[120px] text-center'>
            <span className='inline-block animate-word-cycle'>
              Crafting magic
            </span>
            <span className='inline-block animate-word-cycle delay-1000'>
              Mixing potions
            </span>
            <span className='inline-block animate-word-cycle delay-2000'>
              Summoning data
            </span>
          </span>
        </div>

        {/* CSS for custom animations */}
        <style jsx>{`
          @keyframes border-pulse {
            0%,
            100% {
              border-color: rgba(236, 72, 153, 0.1);
            }
            50% {
              border-color: rgba(96, 165, 250, 0.4);
            }
          }
          @keyframes typing {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }
          @keyframes caret-blink {
            0%,
            100% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          @keyframes float-delay {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          @keyframes word-cycle {
            0%,
            33% {
              transform: translateY(0);
              opacity: 1;
            }
            36%,
            66% {
              transform: translateY(-20px);
              opacity: 0;
            }
            69%,
            100% {
              transform: translateY(-40px);
              opacity: 0;
            }
          }
          .animate-border-pulse {
            animation: border-pulse 2s infinite ease-in-out;
          }
          .animate-typing {
            animation: typing 3s steps(20) infinite;
          }
          .animate-caret-blink {
            animation: caret-blink 1s step-end infinite;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-float-delay {
            animation: float 3s ease-in-out infinite 0.5s;
          }
          .animate-word-cycle {
            animation: word-cycle 6s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (!placeDetails) {
    return (
      <div className='p-4 flex justify-center items-center h-full text-gray-500'>
        Select a place to view details
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 pb-4 ${isMobile ? 'mt-8' : 'mt-0'}`}>
      {placeDetails.images && <ImageCarousel images={placeDetails.images} />}

      <div className=' flex align-middle px-4'>
        <PlaceHeader
          name={placeDetails.business_name}
          type={placeDetails.type}
          subType={placeDetails.sub_type}
        />
      </div>

      <div className='px-4'>
        <ActionButtons />
      </div>

      <div className='px-4'>
        <AddressSection
          address={placeDetails.address}
          holdingNumber={placeDetails.holding_number}
          roadNameNumber={placeDetails.road_name_number}
          area={placeDetails.area}
          city={placeDetails.city}
          postcode={placeDetails.postcode}
        />
      </div>

      {(contact.phone || contact.email || contact.website) && (
        <div className='px-4'>
          <ContactInfo
            phone={contact.phone}
            email={contact.email}
            website={contact.website}
          />
        </div>
      )}

      <div className='px-4'>
        <AdditionalInfo
          district={placeDetails.district}
          thana={placeDetails.thana}
          area={placeDetails.area}
          subArea={placeDetails.sub_area}
        />
      </div>

      <div className='px-4 pt-2 text-xs text-gray-400'>
        <p>
          Location: {placeDetails.latitude}, {placeDetails.longitude}
        </p>
        <p>Place Code: {placeDetails.place_code}</p>
      </div>
    </div>
  );
};

export default DrawerContent;
