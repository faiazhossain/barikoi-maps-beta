// components/SearchBar/DropdownStyles.tsx
"use client";
import { useState, useEffect } from "react";

export const useDropdownStyles = () => {
  const [dropdownStyle, setDropdownStyle] = useState({
    minWidth: "400px",
    top: "60px",
    borderRadius: "0 0 20px 20px",
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 4px 4px, rgba(0, 0, 0, 0.22) 1px 1px 1px",
    padding: "0px",
  });

  useEffect(() => {
    const updateDropdownStyle = () => {
      if (window.innerWidth < 640) {
        setDropdownStyle({
          minWidth: "100%",
          top: "52px",
          borderRadius: "0 0 20px 20px",
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 4px 4px, rgba(0, 0, 0, 0.22) 1px 1px 1px",
          padding: "0px",
        });
      } else {
        setDropdownStyle({
          minWidth: "400px",
          top: "60px",
          borderRadius: "0 0 20px 20px",
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 4px 4px, rgba(0, 0, 0, 0.22) 1px 1px 1px",
          padding: "0px",
        });
      }
    };

    updateDropdownStyle();
    window.addEventListener("resize", updateDropdownStyle);

    return () => {
      window.removeEventListener("resize", updateDropdownStyle);
    };
  }, []);

  return dropdownStyle;
};
