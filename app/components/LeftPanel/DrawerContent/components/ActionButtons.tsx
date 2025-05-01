// components/ActionButtons.tsx
import React, { useState } from 'react';
import { FaShareAlt, FaMapMarkerAlt, FaEdit, FaCheck } from 'react-icons/fa';
import { MdDirections } from 'react-icons/md';
import { motion } from 'framer-motion';

export const ActionButtons = () => {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleActionClick = (action: string) => {
    setActiveAction(action);
    // Reset active state after 1.5 seconds
    setTimeout(() => setActiveAction(null), 1500);
  };

  const buttons = [
    { icon: <FaShareAlt />, label: 'Share', action: 'share' },
    { icon: <MdDirections />, label: 'Directions', action: 'directions' },
    { icon: <FaMapMarkerAlt />, label: 'Nearby', action: 'nearby' },
    { icon: <FaEdit />, label: 'Suggest Edit', action: 'edit' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='flex justify-between py-4 px-2 border-y border-gray-200 bg-gray-50 rounded-lg'
    >
      {buttons.map((btn) => (
        <motion.button
          key={btn.action}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex flex-col items-center text-xs w-full ${
            activeAction === btn.action
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          } transition-colors`}
          onClick={() => handleActionClick(btn.action)}
        >
          <div className='relative'>
            <div
              className={`p-2 rounded-full ${
                activeAction === btn.action ? 'bg-blue-100' : 'bg-white'
              } transition-colors`}
            >
              {activeAction === btn.action ? (
                <FaCheck className='text-lg text-blue-600' />
              ) : (
                React.cloneElement(btn.icon, { className: 'text-lg' })
              )}
            </div>
          </div>
          <span className='mt-1.5 font-medium'>{btn.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};
