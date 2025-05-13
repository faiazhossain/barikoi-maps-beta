// DrawerContent.tsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { PlaceHeader } from "./components/PlaceHeader";
import { ActionButtons } from "./components/ActionButtons";
import { AddressSection } from "./components/AddressSection";
import { ContactInfo } from "./components/ContactInfo";
import { AdditionalInfo } from "./components/AdditionalInfo";
import ImageCarousel from "./components/ImageCarousel";
import useWindowSize from "@/app/hooks/useWindowSize";
import LocationMeta from "./components/LocationMeta";
import MapLoader from "../../common/LoadingPage/MapLoader";
import { useAppSelector } from "@/app/store/store";

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
      ease: "easeOut",
    },
  },
};

const DrawerContent = () => {
  const placeDetails = useAppSelector((state) => state.search.placeDetails);
  const selectedInternationalPlace = useAppSelector(
    (state) => state.search.selectedInternationalPlace
  );
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

  // Handle international place data
  const displayData = useMemo(() => {
    if (selectedInternationalPlace) {
      return {
        business_name: selectedInternationalPlace.name,
        address: selectedInternationalPlace.address,
        images: [], // International places might not have images
        type: "International Location",
        latitude: selectedInternationalPlace.latitude,
        longitude: selectedInternationalPlace.longitude,
      };
    }
    return placeDetails;
  }, [selectedInternationalPlace, placeDetails]);

  if (isLoading || (!placeDetails && !selectedInternationalPlace)) {
    return (
      <div className='absolute inset-0 flex items-center justify-center'>
        <MapLoader />
      </div>
    );
  }

  const displayName = displayData?.business_name || displayData?.place_name;

  return (
    <motion.div
      className={`flex flex-col gap-1 pb-4 ${isMobile ? "mt-8" : "mt-0"}`}
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <ImageCarousel images={displayData.images} />
      </motion.div>

      {displayName && (
        <motion.div className='flex align-middle px-4' variants={itemVariants}>
          <PlaceHeader
            name={displayName}
            type={displayData?.type}
            subType={displayData?.sub_type}
          />
        </motion.div>
      )}

      <motion.div className='px-4' variants={itemVariants}>
        <ActionButtons />
      </motion.div>

      {displayData?.address && (
        <motion.div className='px-4' variants={itemVariants}>
          <AddressSection
            address={displayData.address}
            holdingNumber={displayData?.holding_number}
            roadNameNumber={displayData?.road_name_number}
            area={displayData?.area}
            city={displayData?.city}
            postcode={displayData?.postcode}
            business_name={displayData?.business_name}
            place_name={displayData?.place_name}
            sub_area={displayData?.sub_area}
          />
        </motion.div>
      )}

      {/* Only show contact info for places that have it */}
      {(displayData?.places_additional_data?.[0]?.contact?.phone ||
        displayData?.places_additional_data?.[0]?.contact?.email ||
        displayData?.places_additional_data?.[0]?.contact?.website) && (
        <motion.div className='px-4' variants={itemVariants}>
          <ContactInfo
            phone={displayData?.places_additional_data?.[0]?.contact?.phone}
            email={displayData?.places_additional_data?.[0]?.contact?.email}
            website={displayData?.places_additional_data?.[0]?.contact?.website}
          />
        </motion.div>
      )}

      {/* Only show additional info for places that have it */}
      {(displayData?.district ||
        displayData?.thana ||
        displayData?.area ||
        displayData?.sub_area) && (
        <motion.div className='px-4' variants={itemVariants}>
          <AdditionalInfo
            district={displayData.district}
            thana={displayData.thana}
            area={displayData.area}
            subArea={displayData.sub_area}
          />
        </motion.div>
      )}

      <motion.div className='px-4' variants={itemVariants}>
        <LocationMeta placeDetails={displayData} />
      </motion.div>
    </motion.div>
  );
};

export default DrawerContent;
