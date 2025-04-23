// components/SearchBar/SuggestionOptions.tsx
'use client';
import React from 'react';

interface SuggestionItem {
  name: string;
  address: string;
}

export const getSuggestionOptions = (suggestions: SuggestionItem[]) => {
  return suggestions.map((item) => ({
    value: item.name,
    label: (
      <div className="flex flex-col">
        <span className="!font-medium">{item.name}</span>
        <span className="!text-sm !text-gray-500">{item.address}</span>
      </div>
    ),
  }));
};
