import React, { useState } from "react";
import Slider from "react-slick";
import { Tooltip } from "antd";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./NearbyCategories.module.css";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  setSelectedCategories,
  setNearbyLoading,
  setSearchCenter,
} from "@/app/store/slices/searchSlice";
import {
  FaUtensils,
  FaHotel,
  FaCoffee,
  FaShoppingBag,
  FaGasPump,
  FaHospital,
  FaSchool,
  FaParking,
  FaSpinner,
} from "react-icons/fa";
import { setViewport } from "@/app/store/slices/mapSlice";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function SampleNextArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles["next-arrow"]} !flex items-center justify-center opacity-70 hover:opacity-100`}
      style={{
        ...style,
        display: "block",
        height: "100%",
        top: "9px",
        transform: "translateY(0)",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles["prev-arrow"]} !flex items-center justify-center opacity-70 hover:opacity-100`}
      style={{
        ...style,
        display: "block",
        height: "100%",
        top: "9px",
        transform: "translateY(0)",
      }}
      onClick={onClick}
    />
  );
}

const NearbyCategories = () => {
  const dispatch = useAppDispatch();
  const { viewport } = useAppSelector((state) => state.map);
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  // Add flag to prevent multiple rapid requests for the same category
  const [lastSelectedCategory, setLastSelectedCategory] = useState<
    string | null
  >(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 7,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    swipeToSlide: true,
    focusOnSelect: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
        },
      },
    ],
  };

  const categories = [
    { icon: <FaUtensils />, name: "Restaurant", value: "Restaurant" },
    { icon: <FaHotel />, name: "Hotels", value: "Hotel" },
    { icon: <FaCoffee />, name: "Cafés", value: "Cafe" },
    { icon: <FaShoppingBag />, name: "Shopping", value: "Shopping" },
    { icon: <FaGasPump />, name: "Gas Stations", value: "Gas Station" },
    { icon: <FaHospital />, name: "Hospitals", value: "Hospital" },
    { icon: <FaSchool />, name: "Schools", value: "School" },
    { icon: <FaParking />, name: "Parking", value: "Parking" },
  ];

  const handleCategoryClick = (category: string) => {
    // Skip if we've just selected this category to prevent duplicate API calls
    if (category === lastSelectedCategory && loadingCategory) {
      return;
    }

    setLoadingCategory(category);
    setLastSelectedCategory(category);

    if (navigator.geolocation) {
      dispatch(setNearbyLoading(true));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Set the search center with user's location
          dispatch(setSearchCenter({ latitude: lat, longitude: lng }));

          dispatch(
            setViewport({
              longitude: lng,
              latitude: lat,
              zoom: 16,
            })
          );

          dispatch(setSelectedCategories([category]));
          dispatch(setNearbyLoading(false));
          setLoadingCategory(null);
        },
        (error) => {
          console.warn("Geolocation error:", error);

          // If geolocation fails, use current viewport center
          const { hash } = window.location;
          let lat = viewport.latitude;
          let lng = viewport.longitude;
          let zoom = 16;

          if (hash) {
            const hashParts = hash.substring(1).split("/");
            if (hashParts.length >= 3) {
              zoom = parseFloat(hashParts[0] ?? "0");
              lat = parseFloat(hashParts[1] ?? "0");
              lng = parseFloat(hashParts[2] ?? "0");
            }
          }

          // Set the search center with current viewport
          dispatch(setSearchCenter({ latitude: lat, longitude: lng }));

          dispatch(
            setViewport({
              longitude: lng,
              latitude: lat,
              zoom: zoom,
            })
          );

          dispatch(setSelectedCategories([category]));
          dispatch(setNearbyLoading(false));
          setLoadingCategory(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      // If geolocation is not supported, use current viewport
      dispatch(
        setSearchCenter({
          latitude: viewport.latitude,
          longitude: viewport.longitude,
        })
      );

      dispatch(
        setViewport({
          latitude: viewport.latitude,
          longitude: viewport.longitude,
          zoom: 16,
        })
      );
      dispatch(setSelectedCategories([category]));
      setLoadingCategory(null);
    }
  };

  return (
    <div className='min-w-[300px] max-w-[400px] mt-0 mx-auto lg:mr-auto lg:mx-0 sm:mt-[16px] sm:top-2 z-10 opacity-90 hover:opacity-100 transition-opacity'>
      <div className='bg-white bg-opacity-90 rounded-full backdrop-blur-sm shadow-sm'>
        <div className='w-3/4 mx-auto'>
          <Slider {...settings}>
            {categories.map((category, index) => (
              <div key={index} className='px-2'>
                <div className='flex flex-col items-center'>
                  <Tooltip
                    title={
                      loadingCategory === category.value
                        ? "Getting your location..."
                        : category.name
                    }
                    placement='bottom'
                    mouseEnterDelay={0.1}
                    mouseLeaveDelay={0.1}
                    classNames={{ root: "!mt-2" }}
                    arrow={{ pointAtCenter: true }}
                  >
                    <motion.button
                      className='w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-500 hover:text-green-600 transition-colors duration-300'
                      whileHover={{
                        scale: 1.2,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryClick(category.value)}
                      aria-label={`Search nearby ${category.name}`}
                      disabled={loadingCategory !== null}
                    >
                      {loadingCategory === category.value ? (
                        <span className='text-lg animate-spin'>
                          <FaSpinner />
                        </span>
                      ) : (
                        <span className='text-lg'>{category.icon}</span>
                      )}
                    </motion.button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default NearbyCategories;
