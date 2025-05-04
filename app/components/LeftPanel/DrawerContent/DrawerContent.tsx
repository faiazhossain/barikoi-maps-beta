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

const DrawerContent = ({ placeDetailsLoading }) => {
  const placeDetails = useAppSelector((state) => state.search.placeDetails);
  const windowSize = useWindowSize();
  const isMobile = useMemo(
    () => windowSize.width <= MOBILE_BREAKPOINT,
    [windowSize.width]
  );

  const contact: ContactInfoData =
    placeDetails?.places_additional_data?.[0]?.contact || {};

  if (placeDetailsLoading || !placeDetails) {
    return (
      <div className='absolute inset-0 flex items-center justify-center'>
        <MapLoader />
      </div>
    );
  }

  return (
    <motion.div
      className={`flex flex-col gap-1 pb-4 ${isMobile ? 'mt-8' : 'mt-0'}`}
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      {placeDetails.images && (
        <motion.div variants={itemVariants}>
          <ImageCarousel images={placeDetails.images} />
        </motion.div>
      )}

      <motion.div className='flex align-middle px-4' variants={itemVariants}>
        <PlaceHeader
          name={placeDetails.business_name || placeDetails.place_name}
          type={placeDetails.type}
          subType={placeDetails.sub_type}
        />
      </motion.div>

      <motion.div className='px-4' variants={itemVariants}>
        <ActionButtons />
      </motion.div>

      <motion.div className='px-4' variants={itemVariants}>
        <AddressSection
          address={placeDetails.address}
          holdingNumber={placeDetails.holding_number}
          roadNameNumber={placeDetails.road_name_number}
          area={placeDetails.area}
          city={placeDetails.city}
          postcode={placeDetails.postcode}
        />
      </motion.div>

      {(contact.phone || contact.email || contact.website) && (
        <motion.div className='px-4' variants={itemVariants}>
          <ContactInfo
            phone={contact.phone}
            email={contact.email}
            website={contact.website}
          />
        </motion.div>
      )}

      <motion.div className='px-4' variants={itemVariants}>
        <AdditionalInfo
          district={placeDetails.district}
          thana={placeDetails.thana}
          area={placeDetails.area}
          subArea={placeDetails.sub_area}
        />
      </motion.div>

      <motion.div className='px-4' variants={itemVariants}>
        <LocationMeta placeDetails={placeDetails} />
      </motion.div>

      {placeDetails && (
        <div className='px-4 py-3'>
          {placeDetails.business_name && (
            <h2 className='text-xl font-bold text-gray-800'>
              {placeDetails.business_name}
            </h2>
          )}

          {placeDetails.place_name && (
            <h3 className='text-lg font-semibold text-gray-700'>
              {placeDetails.place_name}
            </h3>
          )}

          {placeDetails.address && (
            <p className='mt-2 text-gray-600'>{placeDetails.address}</p>
          )}

          <div className='mt-4 grid grid-cols-2 gap-3 text-sm'>
            {placeDetails.type && (
              <div>
                <span className='text-gray-500'>Type</span>
                <p className='font-medium'>{placeDetails.type}</p>
              </div>
            )}

            {placeDetails.sub_type && (
              <div>
                <span className='text-gray-500'>Sub Type</span>
                <p className='font-medium'>{placeDetails.sub_type}</p>
              </div>
            )}

            {placeDetails.area && (
              <div>
                <span className='text-gray-500'>Area</span>
                <p className='font-medium'>{placeDetails.area}</p>
              </div>
            )}

            {placeDetails.city && (
              <div>
                <span className='text-gray-500'>City</span>
                <p className='font-medium'>{placeDetails.city}</p>
              </div>
            )}
          </div>

          {/* Display images if available */}
          {placeDetails.images && placeDetails.images.length > 0 && (
            <div className='mt-4'>
              <h4 className='font-medium text-gray-700 mb-2'>Images</h4>
              <div className='grid grid-cols-2 gap-2'>
                {placeDetails.images.map((image) => (
                  <div
                    key={image.id}
                    className='aspect-video rounded overflow-hidden'
                  >
                    <img
                      src={image.url}
                      alt={
                        placeDetails.business_name || placeDetails.place_name
                      }
                      className='w-full h-full object-cover'
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DrawerContent;
