import React from 'react';
import { AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './SearchBar/SearchBar.module.css';
import { useDropdownStyles } from '../hooks/useDropdownStyles';

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
  onSelect: (value: string) => void;
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
    <AutoComplete
      className="searchbar_autocomplete !w-full !ml-2
        [&_.ant-select-selector]:!border-none 
        [&_.ant-select-selector]:!shadow-none 
        [&_.ant-select-selector]:!rounded-[62px] 
        [&_.ant-select-selector]:!bg-transparent
        [&_.ant-select-selection-search-input]:!p-0"
      value={value}
      onDropdownVisibleChange={onDropdownVisibleChange}
      options={options}
      allowClear={{ clearIcon: <div className="hidden bg-none"></div> }}
      onSearch={onSearch}
      onSelect={onSelect}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      size="large"
      prefix={<SearchOutlined className="!text-gray-400" />}
      dropdownRender={(menu) => (
        <div
          className={`${styles['dropdown-animation']} ${
            isExpanded || isAnimating ? styles['show'] : ''
          }`}
        >
          {menu}
        </div>
      )}
      dropdownStyle={dropdownStyle}
      defaultActiveFirstOption={false}
      showSearch={true}
      filterOption={false} // Important: disable local filtering
    />
  );
};

export default SearchInput;
