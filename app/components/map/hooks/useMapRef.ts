// hooks/useMapRef.ts
import { useRef } from 'react';
import type { Map } from 'maplibre-gl';

export const useMapRef = () => {
  return useRef<Map | null>(null);
};
