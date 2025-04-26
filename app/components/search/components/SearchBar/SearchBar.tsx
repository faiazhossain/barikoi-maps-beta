// components/SearchBar/SearchBar.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Space } from "antd";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import "./styles.css";
import { setSearchTerm, setSuggestions } from "@/app/store/slices/searchSlice";
import { useSearchHandler } from "../../hooks/useSearchHandler";
import ClearButton from "../ClearButton";
import DirectionsToggle from "../DirectionToggle";
import SearchInput from "../SearchInput";
import CountrySelect from "../CountrySelect/CountrySelect";
import { getSuggestionOptions } from "../../hooks/useSuggestionsOptions";
import { AnimatePresence, motion } from "framer-motion";

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, suggestions, searchMode } = useAppSelector(
    (state) => state.search
  );
  const [isExpanded, setIsExpanded] = useState(false);
  console.log("🚀 ~ isExpanded:", isExpanded);
  const [isAnimating, setIsAnimating] = useState(false);
  const { handleSearch } = useSearchHandler(dispatch);
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);
  // Pass searchTerm to getSuggestionOptions for highlighting
  const options = getSuggestionOptions(suggestions, searchTerm);

  useEffect(() => {
    if (suggestions.length > 0) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [suggestions]);

  useEffect(() => {
    if (!isExpanded) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [isExpanded]);

  const handleSelect = (value: string) => {
    dispatch(setSearchTerm(value));
    dispatch(setSuggestions([]));
    setIsExpanded(false);
  };

  const handleInputChange = (value: string) => {
    dispatch(setSearchTerm(value));
    handleSearch(value); // Debounced search
  };

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 sm:hidden"
            onClick={() => {
              setIsExpanded(false);
              // dispatch(setSuggestions([]));
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative left-0 w-screen min-w-[300px] sm:top-4 lg:left-4 z-30 sm:w-full sm:max-w-[400px]">
        <div
          className={`bg-white transition-all duration-100 ${
            isExpanded
              ? `${
                  isVisible ? "rounded-none" : "rounded-t-[20px]"
                } sm:rounded-t-[20px]`
              : "rounded-none sm:rounded-full"
          } shadow-deep`}
        >
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <SearchInput
                value={searchTerm}
                options={options}
                placeholder={
                  searchMode === "directions"
                    ? "Enter start location"
                    : "Search places..."
                }
                isExpanded={isExpanded}
                isAnimating={isAnimating}
                onSearch={handleInputChange}
                onSelect={handleSelect}
                onChange={handleInputChange}
                onBlur={() => setIsExpanded(false)}
                onDropdownVisibleChange={(open) => {
                  if (open && suggestions.length > 0) {
                    setIsExpanded(true);
                  } else {
                    setIsExpanded(false);
                  }
                }}
              />
              <ClearButton searchTerm={searchTerm} />
            </div>
            <Space size={0} className="!ml-2">
              <DirectionsToggle />
              <CountrySelect />
            </Space>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
