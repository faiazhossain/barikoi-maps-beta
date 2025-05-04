// DrawerContent.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PlaceHeader } from './components/PlaceHeader';
import { ActionButtons } from './components/ActionButtons';
import { AddressSection } from './components/AddressSection';
import { ContactInfo } from './components/ContactInfo';
import { AdditionalInfo } from './components/AdditionalInfo';
import ImageCarousel from './components/ImageCarousel';
import useWindowSize from '@/app/hooks/useWindowSize';
import LocationMeta from './components/LocationMeta';
import MapLoader from '../../common/LoadingPage/MapLoader';
import { useAppSelector } from '@/app/store/store';

interface ContactInfoData {
  name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
}

const MOBILE_BREAKPOINT = 823;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const DrawerContent = () => {
  const placeDetails = useAppSelector((state) => state.search.placeDetails);
  const placeDetailsLoading = useAppSelector(
    (state) => state.search.placeDetailsLoading
  );
  const reverseGeocodeLoading = useAppSelector(
    (state) => state.search.reverseGeocodeLoading
  );
  const windowSize = useWindowSize();
  const isMobile = useMemo(
    () => windowSize.width <= MOBILE_BREAKPOINT,
    [windowSize.width]
  );

  // Show loading state when either place details or reverse geocode is loading
  const isLoading = placeDetailsLoading || reverseGeocodeLoading;

  const contact: ContactInfoData =
    placeDetails?.places_additional_data?.[0]?.contact || {};

  if (isLoading || !placeDetails) {
    return (
      <div className='absolute inset-0 flex items-center justify-center'>
        <MapLoader />
      </div>
    );
  }

  const displayName = placeDetails.business_name || placeDetails.place_name;

  return (
    <motion.div
      className={`flex flex-col gap-1 pb-4 ${isMobile ? 'mt-8' : 'mt-0'}`}
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <ImageCarousel images={placeDetails.images} />
      </motion.div>

      {displayName && (
        <motion.div className='flex align-middle px-4' variants={itemVariants}>
          <PlaceHeader
            name={displayName}
            type={placeDetails.type}
            subType={placeDetails.sub_type}
          />
        </motion.div>
      )}

      <motion.div className='px-4' variants={itemVariants}>
        <ActionButtons />
      </motion.div>

      {placeDetails.address && (
        <motion.div className='px-4' variants={itemVariants}>
          <AddressSection
            address={placeDetails.address}
            holdingNumber={placeDetails.holding_number}
            roadNameNumber={placeDetails.road_name_number}
            area={placeDetails.area}
            city={placeDetails.city}
            postcode={placeDetails.postcode}
            business_name={placeDetails.business_name}
            place_name={placeDetails.place_name}
            sub_area={placeDetails.sub_area}
          />
        </motion.div>
      )}

      {(contact?.phone || contact?.email || contact?.website) && (
        <motion.div className='px-4' variants={itemVariants}>
          <ContactInfo
            phone={contact.phone}
            email={contact.email}
            website={contact.website}
          />
        </motion.div>
      )}

      {(placeDetails.district ||
        placeDetails.thana ||
        placeDetails.area ||
        placeDetails.sub_area) && (
        <motion.div className='px-4' variants={itemVariants}>
          <AdditionalInfo
            district={placeDetails.district}
            thana={placeDetails.thana}
            area={placeDetails.area}
            subArea={placeDetails.sub_area}
          />
        </motion.div>
      )}

      <motion.div className='px-4' variants={itemVariants}>
        <LocationMeta placeDetails={placeDetails} />
      </motion.div>
    </motion.div>
  );
};

export default DrawerContent;
