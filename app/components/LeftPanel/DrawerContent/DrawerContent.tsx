// DrawerContent.tsx
import React, { useMemo } from 'react';

import { PlaceHeader } from './components/PlaceHeader';
import { ActionButtons } from './components/ActionButtons';
import { AddressSection } from './components/AddressSection';
import { ContactInfo } from './components/ContactInfo';
import { AdditionalInfo } from './components/AdditionalInfo';
import ImageCarousel from './components/ImageCarousel';
import useWindowSize from '@/app/hooks/useWindowSize';

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

  const contact: ContactInfoData =
    placeDetails?.places_additional_data?.[0]?.contact || {};

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
