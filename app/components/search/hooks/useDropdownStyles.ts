// components/SearchBar/DropdownStyles.tsx
'use client';
import { useAppSelector } from '@/app/store/store';
import { useState, useEffect } from 'react';

export const useDropdownStyles = () => {
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);
  const [dropdownStyle, setDropdownStyle] = useState({
    minWidth: '400px',
    top: '60px',
    borderRadius: '0 0 20px 20px',
    boxShadow:
      'rgba(0, 0, 0, 0.25) 0px 4px 4px, rgba(0, 0, 0, 0.22) 1px 1px 1px',
    padding: '0px',
    zIndex: 2001,
  });

  useEffect(() => {
    const updateDropdownStyle = () => {
      if (window.innerWidth < 640) {
        setDropdownStyle({
          minWidth: '100%',
          top: isVisible ? '97px' : '52px',
          borderRadius: '0 0 20px 20px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 4px 4px, rgba(0, 0, 0, 0.22) 1px 1px 1px',
          padding: '0px',
          zIndex: 10,
        });
      } else {
        setDropdownStyle({
          minWidth: '400px',
          top: '60px',
          borderRadius: '0 0 20px 20px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 4px 4px, rgba(0, 0, 0, 0.22) 1px 1px 1px',
          padding: '0px',
          zIndex: 2001,
        });
      }
    };

    updateDropdownStyle();
    window.addEventListener('resize', updateDropdownStyle);

    return () => {
      window.removeEventListener('resize', updateDropdownStyle);
    };
  }, [isVisible]);

  return dropdownStyle;
};
