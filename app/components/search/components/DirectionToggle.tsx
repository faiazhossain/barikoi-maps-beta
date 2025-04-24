// components/SearchBar/DirectionsToggle.tsx
import React from 'react';
import { Button, Space } from 'antd';

import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { toggleDirections } from '@/app/store/slices/mapSlice';
import { clearDirections, setSearchMode } from '@/app/store/slices/searchSlice';
import { FaDirections } from 'react-icons/fa';

const DirectionsToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showDirections } = useAppSelector((state) => state.map);

  const handleDirectionsToggle = () => {
    dispatch(toggleDirections());
    if (!showDirections) {
      dispatch(setSearchMode('directions'));
    } else {
      dispatch(clearDirections());
      dispatch(setSearchMode('location'));
    }
  };

  return (
    <Button
      type="text"
      icon={<FaDirections />}
      onClick={handleDirectionsToggle}
      className={`!transition-colors !text-[16px] hover:!bg-none ${
        showDirections ? '!text-primary' : '!text-gray-400'
      } hover:!text-primary`} // Use primary.DEFAULT on hover
    />
  );
};

export default DirectionsToggle;
