// components/SearchBar/DropdownStyles.tsx
"use client";
import { useState, useEffect } from "react";

export const useDropdownStyles = () => {
  const [dropdownStyle, setDropdownStyle] = useState({
    minWidth: "400px",
    left: "17px",
    top: "60px",
    borderRadius: "0 0 20px 20px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 3px 5px",
    padding: "10px",
  });

  useEffect(() => {
    const updateDropdownStyle = () => {
      if (window.innerWidth < 640) {
        setDropdownStyle({
          minWidth: "100%",
          left: "0px",
          top: "52px",
          borderRadius: "0 0 20px 20px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 3px 5px",
          padding: "10px",
        });
      } else {
        setDropdownStyle({
          minWidth: "400px",
          left: "16px",
          top: "60px",
          borderRadius: "0 0 20px 20px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 3px 5px",
          padding: "10px",
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
