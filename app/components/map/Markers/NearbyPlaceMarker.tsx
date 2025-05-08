"use client";
import React, { useState } from "react";
import { Marker, MarkerEvent } from "react-map-gl/maplibre";
import { Popover } from "antd";
import {
  FaUtensils,
  FaHotel,
  FaHospital,
  FaSchool,
  FaStore,
  FaUniversity,
  FaBriefcase,
  FaQuestion,
  FaGasPump,
  FaMosque,
  FaChurch,
  FaParking,
  FaCoffee,
  FaShoppingCart,
  FaWrench,
  FaPrescriptionBottleAlt,
  FaBus,
  FaLandmark,
  FaMoneyBillWave,
} from "react-icons/fa";
import { NearbyPlace } from "@/app/types/map";
import { useAppSelector } from "@/app/store/store";
import { motion } from "framer-motion";

interface NearbyPlaceMarkerProps {
  place: NearbyPlace;
  onClick: (place: NearbyPlace) => void;
}

/**
 * Get the appropriate icon based on place type
 */
const getPlaceIcon = (pType: string) => {
  switch (pType.toLowerCase()) {
    case "food":
      return <FaUtensils className="h-3.5 w-3.5" />;
    case "hotel":
      return <FaHotel className="h-3.5 w-3.5" />;
    case "health":
    case "hospital":
    case "clinic":
      return <FaHospital className="h-3.5 w-3.5" />;
    case "education":
    case "school":
      return <FaSchool className="h-3.5 w-3.5" />;
    case "shopping":
    case "shop":
      return <FaStore className="h-3.5 w-3.5" />;
    case "university":
    case "college":
      return <FaUniversity className="h-3.5 w-3.5" />;
    case "business":
    case "office":
      return <FaBriefcase className="h-3.5 w-3.5" />;
    case "gas":
    case "fuel":
    case "petrol":
      return <FaGasPump className="h-3.5 w-3.5" />;
    case "mosque":
    case "masjid":
      return <FaMosque className="h-3.5 w-3.5" />;
    case "church":
    case "temple":
      return <FaChurch className="h-3.5 w-3.5" />;
    case "parking":
      return <FaParking className="h-3.5 w-3.5" />;
    case "cafe":
    case "coffee":
      return <FaCoffee className="h-3.5 w-3.5" />;
    case "supermarket":
    case "market":
      return <FaShoppingCart className="h-3.5 w-3.5" />;
    case "service":
    case "repair":
    case "garage":
      return <FaWrench className="h-3.5 w-3.5" />;
    case "pharmacy":
    case "medicine":
      return <FaPrescriptionBottleAlt className="h-3.5 w-3.5" />;
    case "bus":
    case "station":
    case "transport":
      return <FaBus className="h-3.5 w-3.5" />;
    case "bank":
    case "atm":
      return <FaMoneyBillWave className="h-3.5 w-3.5" />;
    case "government":
    case "civic":
      return <FaLandmark className="h-3.5 w-3.5" />;
    default:
      return <FaQuestion className="h-3.5 w-3.5" />;
  }
};

/**
 * Get marker color based on place type
 */
const getMarkerColor = (pType: string): string => {
  switch (pType.toLowerCase()) {
    case "food":
      return "bg-rose-600";
    case "hotel":
      return "bg-blue-600";
    case "health":
    case "hospital":
    case "pharmacy":
    case "medicine":
      return "bg-red-500";
    case "education":
    case "school":
    case "university":
    case "college":
      return "bg-green-600";
    case "shopping":
    case "shop":
    case "supermarket":
    case "market":
      return "bg-purple-600";
    case "business":
    case "office":
      return "bg-slate-600";
    case "gas":
    case "fuel":
    case "petrol":
      return "bg-emerald-500";
    case "mosque":
    case "masjid":
    case "church":
    case "temple":
      return "bg-indigo-600";
    case "parking":
      return "bg-cyan-600";
    case "cafe":
    case "coffee":
      return "bg-amber-700";
    case "service":
    case "repair":
    case "garage":
      return "bg-zinc-600";
    case "bus":
    case "station":
    case "transport":
    case "metro":
      return "bg-teal-600";
    case "bank":
    case "atm":
      return "bg-lime-700";
    case "government":
    case "civic":
      return "bg-fuchsia-700";
    default:
      return "bg-blue-500";
  }
};

const NearbyPlaceMarker: React.FC<NearbyPlaceMarkerProps> = ({
  place,
  onClick,
}) => {
  // Get the hovered place ID from Redux
  const hoveredPlaceId = useAppSelector(
    (state) => state.search.hoveredNearbyPlaceId
  );
  const isHovered = hoveredPlaceId === String(place.id);

  // Local state for popover visibility (for antd popover)
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleMarkerClick = (e: MarkerEvent<MouseEvent>) => {
    e.originalEvent?.preventDefault();
    e.originalEvent?.stopPropagation();
    onClick(place);
  };

  return (
    <Marker
      longitude={parseFloat(place.longitude)}
      latitude={parseFloat(place.latitude)}
      anchor="top"
      onClick={handleMarkerClick}
    >
      <Popover
        content={place.name}
        title={null}
        placement="top"
        open={popoverOpen}
        className="nearby-place-popover max-w-[250px]"
        onOpenChange={setPopoverOpen}
        trigger="hover"
      >
        <div
          className="cursor-pointer transform transition-transform hover:scale-110"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-7 h-7 rounded-full ${getMarkerColor(
                place.pType
              )} flex items-center justify-center text-white shadow-md border-2 border-white`}
              animate={{
                scale: isHovered ? 1.2 : 1,
                boxShadow: isHovered
                  ? "0 0 0 4px rgba(59, 130, 246, 0.5)"
                  : "none",
              }}
              transition={{ duration: 0.2 }}
            >
              {getPlaceIcon(place.pType)}
            </motion.div>
          </div>
        </div>
      </Popover>
    </Marker>
  );
};

export default NearbyPlaceMarker;
