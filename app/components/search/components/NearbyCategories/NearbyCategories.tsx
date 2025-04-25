"use client";

import React from "react";
import Slider from "react-slick";
import { Button } from "antd";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { setSelectedCategory } from "@/app/store/slices/searchSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./NearbyCategories.module.css";
const categories = [
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
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
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
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
  }

  function SampleNextArrow(props: ArrowProps) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          top: "50%", // Center vertically
          transform: "translateY(-27%)", // Adjust for proper centering
          right: "10px", // Adjust horizontal position if needed
          zIndex: 1, // Ensure it appears above other elements
        }}
        onClick={onClick}
      />
    );
  }

  interface SamplePrevArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
  }

  function SamplePrevArrow(props: SamplePrevArrowProps) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} ${styles["prev-arrow"]}`}
        style={{
          ...style,
          display: "block",
          top: "50%", // Center vertically
          transform: "translateY(-27%)", // Adjust for proper centering
          left: "-23px !important", // Adjust horizontal position if needed
          zIndex: 1, // Ensure it appears above other elements
        }}
        onClick={onClick}
      />
    );
  }

  const handleCategoryClick = (categoryId: string) => {
    dispatch(
      setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
    );
  };

  return (
    <div className="absolute w-auto top-20 mr-12 ml-12 sm:ml-0 max-w-[280px] left-0 sm:top-4 sm:left-[450px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[940px] sm:right-4 z-10 rounded-lg">
      <Slider {...settings}>
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="px-[2px] [&_.ant-btn]:!p-0 !pb-2 !pt-1"
          >
            <Button
              type={selectedCategory === category.id ? "primary" : "default"}
              className={`!w-[130px] !h-[36px] !flex !items-center !justify-center !rounded-full !transition-all !duration-300 ${
                selectedCategory === category.id
                  ? "!shadow-custom"
                  : "!shadow-deep"
              }`}
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
