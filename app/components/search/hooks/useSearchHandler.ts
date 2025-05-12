// components/SearchBar/SearchHandler.tsx
"use client";
import { useCallback } from "react";
import { setSuggestions } from "@/app/store/slices/searchSlice";
import { AppDispatch } from "@/app/store/store";

export const useSearchHandler = (dispatch: AppDispatch) => {
  const handleSearch = useCallback(
    async (
      value: string,
      countryCode?: string,
      longitude?: number,
      latitude?: number
    ) => {
      if (!value.trim()) {
        dispatch(setSuggestions([]));
        return;
      }

      try {
        // Construct URL with search parameters
        const params = new URLSearchParams({
          query: value,
        });

        // Add country code if provided
        if (countryCode) {
          params.append("country_code", countryCode);
        }

        // Add coordinates if provided
        if (longitude !== undefined && latitude !== undefined) {
          params.append("longitude", longitude.toString());
          params.append("latitude", latitude.toString());
        }

        const response = await fetch(`/api/autocomplete?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data = await response.json();
        dispatch(setSuggestions(data.places || []));
      } catch (error) {
        console.error("Search error:", error);
        dispatch(setSuggestions([]));
      }
    },
    [dispatch]
  );

  return { handleSearch };
};
