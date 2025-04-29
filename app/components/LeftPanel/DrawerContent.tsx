import React from 'react';
import { useAppSelector } from '@/app/store/store';
import ImageCarousel from './ImageCarousel';

interface ContactInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
}

const DrawerContent = ({ placeDetails }) => {
  const isLoading = useAppSelector((state) => state.search.placeDetailsLoading);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!placeDetails) {
    return <div className="p-4">Select a place to view details</div>;
  }

  const contact: ContactInfo =
    placeDetails.places_additional_data?.[0]?.contact || {};

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Replace the existing image section with ImageCarousel */}
      {placeDetails.images && placeDetails.images.length > 0 && (
        <ImageCarousel images={placeDetails.images} />
      )}

      {/* Basic Information */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{placeDetails.business_name}</h2>
        <p className="text-gray-600">
          {placeDetails.type} • {placeDetails.sub_type}
        </p>

        {/* Address */}
        <div className="text-sm text-gray-600">
          <p>
            {placeDetails.holding_number}, {placeDetails.road_name_number}
          </p>
          <p>
            {placeDetails.area}, {placeDetails.city}
          </p>
          <p>Postcode: {placeDetails.postcode}</p>
        </div>
      </div>

      {/* Contact Information */}
      {(contact.phone || contact.email || contact.website) && (
        <div className="space-y-2 border-t pt-4">
          <h3 className="font-medium">Contact Information</h3>
          {contact.phone && (
            <p className="text-sm">
              <span className="text-gray-600">Phone:</span> {contact.phone}
            </p>
          )}
          {contact.email && (
            <p className="text-sm">
              <span className="text-gray-600">Email:</span> {contact.email}
            </p>
          )}
          {contact.website && (
            <p className="text-sm">
              <span className="text-gray-600">Website:</span>{' '}
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {contact.website}
              </a>
            </p>
          )}
        </div>
      )}

      {/* Additional Details */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="font-medium">Additional Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <span className="text-gray-600">District:</span>{' '}
            {placeDetails.district}
          </p>
          <p>
            <span className="text-gray-600">Thana:</span> {placeDetails.thana}
          </p>
          <p>
            <span className="text-gray-600">Area:</span> {placeDetails.area}
          </p>
          <p>
            <span className="text-gray-600">Sub Area:</span>{' '}
            {placeDetails.sub_area}
          </p>
        </div>
      </div>

      {/* Location Coordinates */}
      <div className="text-xs text-gray-500 border-t pt-4">
        <p>
          Location: {placeDetails.latitude}, {placeDetails.longitude}
        </p>
        <p>Place Code: {placeDetails.place_code}</p>
      </div>
    </div>
  );
};

export default DrawerContent;
