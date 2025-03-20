"use client";

import React, { useState } from "react";
import { Input, AutoComplete, Button, Select, Space } from "antd";
import {
  SearchOutlined,
  SwapOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  setSearchTerm,
  setSearchMode,
  clearDirections,
} from "@/app/store/slices/searchSlice";
import {
  toggleDirections,
  setSelectedCountry,
} from "@/app/store/slices/mapSlice";

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, suggestions, searchMode } = useAppSelector(
    (state) => state.search
  );
  const { showDirections } = useAppSelector((state) => state.map);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
    // TODO: Implement API call for suggestions
  };

  const handleDirectionsToggle = () => {
    dispatch(toggleDirections());
    if (!showDirections) {
      dispatch(setSearchMode("directions"));
    } else {
      dispatch(clearDirections());
      dispatch(setSearchMode("location"));
    }
  };

  const handleCountrySelect = (value: string) => {
    dispatch(setSelectedCountry(value));
    // TODO: Implement map fly to country
  };

  return (
    <div className="absolute top-2 left-0 w-screen sm:top-4 sm:left-4 z-10 sm:w-full sm:max-w-[400px]">
      <div
        className={`bg-white rounded-full transition-all duration-300 ${
          isExpanded ? "rounded-lg" : ""
        } shadow-lg hover:shadow-xl`}
      >
        <div className="p-2 flex items-center gap-2">
          <AutoComplete
            className="!w-full [&_.ant-select-selector]:!border-none [&_.ant-select-selection-search-input]:!p-0"
            value={searchTerm}
            options={suggestions.map((item) => ({
              value: item.name,
              label: (
                <div className="flex flex-col">
                  <span className="!font-medium">{item.name}</span>
                  <span className="!text-sm !text-gray-500">
                    {item.address}
                  </span>
                </div>
              ),
            }))}
            onSearch={handleSearch}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
          >
            <Input
              size="large"
              placeholder={
                searchMode === "directions"
                  ? "Enter start location"
                  : "Search places..."
              }
              prefix={<SearchOutlined className="!text-gray-400" />}
              className="!rounded-full !shadow-none !border-none focus:!ring-0 !outline-none [&_.ant-input]:!border-none [&_.ant-input]:!shadow-none [&_.ant-input]:!outline-none [&_.ant-input]:focus:!outline-none !h-full [&_.ant-input]:!h-full [&_.ant-input-prefix]:!h-full [&_.ant-input-prefix]:flex [&_.ant-input-prefix]:items-center"
            />
          </AutoComplete>
          <Space>
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={handleDirectionsToggle}
              className={`!transition-colors ${
                showDirections ? "!text-blue-500" : "!text-gray-500"
              } hover:!text-blue-600`}
            />
            <Select
              placeholder={<GlobalOutlined />}
              onChange={handleCountrySelect}
              className="!w-12 [&_.ant-select-selector]:!border-none"
              bordered={false}
              dropdownStyle={{ minWidth: "120px" }}
              options={[
                { value: "bd", label: "Bangladesh" },
                { value: "in", label: "India" },
                { value: "np", label: "Nepal" },
              ]}
            />
          </Space>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
