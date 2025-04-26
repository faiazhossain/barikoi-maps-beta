import React from "react";
import { AutoComplete } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./SearchBar/SearchBar.module.css";
import { useDropdownStyles } from "../hooks/useDropdownStyles";
import Image from "next/image";

// Define the type for AutoComplete options
interface AutoCompleteOption {
  value: string; // The value of the option
  label?: React.ReactNode; // Optional label for custom rendering
}

interface SearchInputProps {
  value: string;
  options: AutoCompleteOption[]; // Use the defined type here
  placeholder: string;
  isExpanded: boolean;
  isAnimating: boolean;
  onSearch: (value: string) => void;
  onSelect: (value: string, option: any) => void; // Modified to include option parameter
  onChange: (value: string) => void;
  onBlur: () => void;
  onDropdownVisibleChange: (open: boolean) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  options,
  placeholder,
  isExpanded,
  isAnimating,
  onSearch,
  onSelect,
  onChange,
  onBlur,
  onDropdownVisibleChange,
}) => {
  const dropdownStyle = useDropdownStyles();

  return (
    <div className="relative w-full">
      <AutoComplete
        className="searchbar_autocomplete !h-[44px] !w-full
      [&_.ant-select-selector]:!border-none 
      [&_.ant-select-selector]:!shadow-none 
      [&_.ant-select-selector]:!rounded-[62px] 
      [&_.ant-select-selector]:!bg-transparent
      [&_.ant-select-selector]:!px-6
      [&_.ant-select-selection-search-input]:!p-0"
        value={value}
        onDropdownVisibleChange={onDropdownVisibleChange}
        options={options}
        allowClear={{ clearIcon: <div className="hidden bg-none"></div> }}
        onSearch={onSearch}
        onSelect={(value, option) => onSelect(value, option)}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        size="large"
        prefix={<SearchOutlined className="!text-gray-400" />}
        dropdownRender={(menu) => (
          <div className="relative pb-8">
            <div
              className={`${styles["dropdown-animation"]} ${
                isExpanded || isAnimating ? styles["show"] : ""
              }`}
            >
              {menu}
            </div>
            {/* Footer */}
            <div className="absolute bottom-0 right-0 flex items-center gap-1 text-gray-500 text-[11px] p-2">
              <a
                href="https://docs.barikoi.com/api#tag/v2.0/operation/autocomplete_v2" // Link to Barikoi API documentation
                target="_blank" // Open in a new tab
                rel="noopener noreferrer" // Security best practice
                className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
              >
                <span>Autocomplete by</span>
                <Image
                  src="/images/barikoi-logo.svg" // Replace with the actual path to the Barikoi icon
                  alt="Barikoi"
                  width={34} // Adjust the width as needed
                  height={20} // Adjust the height as needed
                />
              </a>
            </div>
          </div>
        )}
        dropdownStyle={dropdownStyle}
        popupMatchSelectWidth={true} // Important: disable width matching
        defaultActiveFirstOption={false}
        showSearch={true}
        filterOption={false} // Important: disable local filtering
      />
    </div>
  );
};

export default SearchInput;
