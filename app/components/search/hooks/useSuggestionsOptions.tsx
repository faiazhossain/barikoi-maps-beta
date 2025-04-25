"use client";
import React from "react";
import { FaMapMarkerAlt, FaHome } from "react-icons/fa";
import { TbMailPin } from "react-icons/tb";

interface SuggestionItem {
  id: string;
  address: string;
  city: string;
  area: string;
  pType: string;
  subType?: string;
  postCode?: number;
  uCode?: string;
}

export const getSuggestionOptions = (
  suggestions: SuggestionItem[],
  inputValue: string
) => {
  return suggestions.map((item) => {
    const highlightMatch = (text: string, search: string) => {
      if (!search.trim()) return text;

      const lowerText = text.toLowerCase();
      const lowerSearch = search.toLowerCase();
      const result: React.ReactNode[] = [];
      let lastIndex = 0;
      let hasMatch = false;

      for (let i = 0; i < lowerSearch.length; i++) {
        const char = lowerSearch[i];
        if (!char) continue;
        const index = lowerText.indexOf(char, lastIndex);

        if (index === -1) continue;
        hasMatch = true;

        if (index > lastIndex) {
          result.push(text.substring(lastIndex, index));
        }

        result.push(
          <strong key={index} className="font-bold">
            {text.substring(index, index + 1)}
          </strong>
        );

        lastIndex = index + 1;
      }

      if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
      }

      return hasMatch ? <>{result}</> : text;
    };

    return {
      value: `${item.address}, ${item.area}, ${item.city}`,
      label: (
        <div className="group flex flex-col py-2 px-3 cursor-pointer transition-colors duration-150">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <div className="flex items-start gap-2 w-full">
                <div className="w-4 m-auto flex-shrink-0">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <span className="text-gray-900 whitespace-normal break-words w-full">
                  {highlightMatch(item.address, inputValue)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2 ml-4">
            {item.pType && (
              <span className="px-2 py-0.5 text-xs bg-[#e0feed] text-gray-800 rounded-full flex items-center gap-1">
                <FaHome size={12} />
                {item.subType ? `${item.pType} (${item.subType})` : item.pType}
              </span>
            )}
            {item.postCode && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full flex items-center gap-1">
                <TbMailPin size={12} />
                {item.postCode}
              </span>
            )}
          </div>
        </div>
      ),
      rawData: item,
    };
  });
};
