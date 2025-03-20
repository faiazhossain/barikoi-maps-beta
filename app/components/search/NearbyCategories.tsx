"use client";

import React from "react";
import Slider from "react-slick";
import { Button } from "antd";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { setSelectedCategory } from "@/app/store/slices/searchSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const categories = [
  { id: "offers", name: "Nearby Offers", icon: "🎁" },
  { id: "atm", name: "ATM", icon: "🏧" },
  { id: "restaurant", name: "Restaurants", icon: "🍽️" },
  { id: "hospital", name: "Hospitals", icon: "🏥" },
  { id: "pharmacy", name: "Pharmacy", icon: "💊" },
  { id: "school", name: "Schools", icon: "🏫" },
  { id: "shopping", name: "Shopping", icon: "🛍️" },
];

const NearbyCategories: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector(
    (state) => state.search.selectedCategory
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7, // Show more slides by default
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1454,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1170,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1030,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 775,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleCategoryClick = (categoryId: string) => {
    dispatch(
      setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
    );
    // TODO: Implement fetching nearby places based on category
  };

  return (
    <div className="absolute top-20 mr-12 ml-12 sm:ml-0 max-w-[300px] left-0 sm:top-4 sm:left-[450px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[940px] sm:right-4 z-10 rounded-lg">
      <Slider {...settings}>
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="px-[2px] [&_.ant-btn]:!p-0"
          >
            <Button
              type={selectedCategory === category.id ? "primary" : "default"}
              className={`!w-[130px] !h-[36px] !flex !items-center !justify-center !rounded-full !shadow-sm ${
                category.id === "offers"
                  ? "!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white hover:!from-blue-600 hover:!to-blue-700 !border-none"
                  : "!bg-white hover:!bg-gray-50 !border !border-gray-200"
              } !transition-all !duration-300`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className="!mr-1 !text-base">{category.icon}</span>
              <span className="!text-xs !font-medium">{category.name}</span>
            </Button>
          </motion.div>
        ))}
      </Slider>
    </div>
  );
};

export default NearbyCategories;
