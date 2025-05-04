// components/SearchBar/ClearButton.tsx
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useAppDispatch } from '@/app/store/store';
import { clearSearch } from '@/app/store/slices/searchSlice';
import { closeLeftBar } from '@/app/store/slices/drawerSlice';
import { setMarkerCoords } from '@/app/store/slices/mapSlice';

interface ClearButtonProps {
  searchTerm: string;
}

const ClearButton: React.FC<ClearButtonProps> = ({ searchTerm }) => {
  const dispatch = useAppDispatch();

  if (!searchTerm) return null;

  const handleClear = () => {
    // Clear all search related states
    dispatch(clearSearch());

    // Close drawer
    dispatch(closeLeftBar());
    dispatch(setMarkerCoords(null));
    // Clear URL parameters
    const currentUrl = new URL(window.location.href);
    if (
      currentUrl.searchParams.has('place') ||
      currentUrl.searchParams.has('rev')
    ) {
      currentUrl.searchParams.delete('place');
      currentUrl.searchParams.delete('rev');
      window.history.replaceState({}, '', currentUrl.toString());
    }
  };

  return (
    <div
      className='absolute -right-4 top-[4px] w-8 h-8 flex items-center justify-center rounded-md transform cursor-pointer !bg-white'
      onClick={handleClear}
    >
      <AiOutlineClose className='text-gray-400 hover:text-red-600 !text-[16px]' />
    </div>
  );
};

export default ClearButton;
