// components/SearchBar/ClearButton.tsx
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useAppDispatch } from '@/app/store/store';
import { setSearchTerm, setSuggestions } from '@/app/store/slices/searchSlice';

interface ClearButtonProps {
  searchTerm: string;
}

const ClearButton: React.FC<ClearButtonProps> = ({ searchTerm }) => {
  const dispatch = useAppDispatch();

  if (!searchTerm) return null;

  return (
    <div
      className="absolute -right-4 top-[4px] w-8 h-8 flex items-center justify-center  rounded-md transform cursor-pointer !bg-white"
      onClick={() => {
        dispatch(setSearchTerm(''));
        dispatch(setSuggestions([]));
      }}
    >
      <AiOutlineClose className="text-gray-400 hover:text-red-600 !text-[16px]" />
    </div>
  );
};

export default ClearButton;
