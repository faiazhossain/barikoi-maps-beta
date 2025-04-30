import React from 'react';
import Slider from 'react-slick';
import { Tooltip } from 'antd';
import { motion } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './NearbyCategories.module.css';
import {
  FaUtensils,
  FaHotel,
  FaCoffee,
  FaShoppingBag,
  FaGasPump,
  FaHospital,
  FaSchool,
  FaParking,
} from 'react-icons/fa';

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function SampleNextArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles['next-arrow']} !flex items-center justify-center opacity-70 hover:opacity-100`}
      style={{
        ...style,
        display: 'block',
        height: '100%',
        top: '9px',
        transform: 'translateY(0)',
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles['prev-arrow']} !flex items-center justify-center opacity-70 hover:opacity-100`}
      style={{
        ...style,
        display: 'block',
        height: '100%',
        top: '9px',
        transform: 'translateY(0)',
      }}
      onClick={onClick}
    />
  );
}

const NearbyCategories = () => {
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
    { icon: <FaUtensils />, name: 'Restaurants' },
    { icon: <FaHotel />, name: 'Hotels' },
    { icon: <FaCoffee />, name: 'Cafés' },
    { icon: <FaShoppingBag />, name: 'Shopping' },
    { icon: <FaGasPump />, name: 'Gas Stations' },
    { icon: <FaHospital />, name: 'Hospitals' },
    { icon: <FaSchool />, name: 'Schools' },
    { icon: <FaParking />, name: 'Parking' },
  ];

  return (
    <div className='min-w-[300px] max-w-[400px] mt-0 mx-auto lg:mr-auto lg:mx-0 sm:mt-[16px] sm:top-2 z-10 opacity-90 hover:opacity-100 transition-opacity'>
      <div className='bg-white bg-opacity-90 rounded-full backdrop-blur-sm'>
        <div className='w-3/4 mx-auto'>
          <Slider {...settings}>
            {categories.map((category, index) => (
              <div key={index} className='px-2'>
                <div className='flex flex-col items-center'>
                  <Tooltip
                    title={category.name}
                    placement='bottom'
                    mouseEnterDelay={0.1}
                    mouseLeaveDelay={0.1}
                    classNames={{ root: '!mt-2' }}
                    arrow={{ pointAtCenter: true }}
                  >
                    <motion.button
                      className='w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-500 hover:text-green-600 transition-colors duration-300'
                      whileHover={{
                        scale: 1.2,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className='text-lg'>{category.icon}</span>
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
