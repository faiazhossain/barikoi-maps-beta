import { useRef } from "react";

const useMapRef = () => {
  const mapRef = useRef(null);
  return mapRef;
};

export default useMapRef;
