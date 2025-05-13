import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const BarikoiAttribution: React.FC = () => {
  return (
    <motion.a
      href='https://barikoi.com'
      target='_blank'
      rel='noopener noreferrer'
      className='absolute z-10'
      style={{ bottom: 16, left: 10 }}
      whileHover={{ scale: 1.15 }}
      transition={{ duration: 0.75 }}
    >
      <Image
        src='/images/barikoi-logo.svg' // Replace with the actual path to the Barikoi logo
        alt='Barikoi Logo'
        width={50}
        height={40}
      />
    </motion.a>
  );
};

export default BarikoiAttribution;
