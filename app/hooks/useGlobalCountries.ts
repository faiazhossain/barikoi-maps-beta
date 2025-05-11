import { useState, useEffect } from 'react';

export interface CountryOption {
  value: string;
  name: string;
  flag: string;
  label: string;
}

// Create a global store for countries data
let globalCountriesData: CountryOption[] | null = null;
let isLoading = false;
let listeners: (() => void)[] = [];

// Notify all listeners when data changes
const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

// Function to get countries data - can be called outside of components
export const getCountriesData = async (): Promise<CountryOption[]> => {
  // Return existing data if we have it
  if (globalCountriesData) {
    return globalCountriesData || [];
  }

  // Check session storage first
  if (typeof window !== 'undefined') {
    const cachedData = sessionStorage.getItem('countriesData');
    if (cachedData) {
      globalCountriesData = JSON.parse(cachedData);
      notifyListeners();
      return globalCountriesData || [];
    }
  }

  // If still no data, fetch it
  if (!isLoading) {
    isLoading = true;
    try {
      const response = await fetch('/data/countries.geojson');
      if (!response.ok) throw new Error('Failed to fetch countries');

      const geojson = await response.json();

      const options = geojson.features
        .map(
          (feature: {
            properties: { ISO_A2: string; ADMIN: string; icon?: string };
          }) => ({
            value: feature.properties.ISO_A2,
            name: feature.properties.ADMIN,
            flag:
              feature.properties.icon ||
              `https://flagcdn.com/w40/${feature.properties.ISO_A2.toLowerCase()}.png`,
            label: feature.properties.ADMIN,
          })
        )
        .sort((a: CountryOption, b: CountryOption) =>
          a.name.localeCompare(b.name)
        );

      // Store in global and session storage
      globalCountriesData = options;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('countriesData', JSON.stringify(options));
      }

      notifyListeners();
      return options;
    } catch (error) {
      console.error('Error loading countries data:', error);
      throw error;
    } finally {
      isLoading = false;
    }
  }

  // Return empty array if loading
  return [];
};

// React hook for components to use countries data
export const useGlobalCountries = () => {
  const [countries, setCountries] = useState<CountryOption[]>(
    globalCountriesData || []
  );
  const [loading, setLoading] = useState(!globalCountriesData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Define the update function
    const updateCountries = () => {
      if (globalCountriesData) {
        setCountries(globalCountriesData);
        setLoading(false);
      }
    };

    // Add listener
    listeners.push(updateCountries);

    // Initialize if needed
    if (!globalCountriesData && !isLoading) {
      setLoading(true);
      getCountriesData()
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          setError(err as Error);
          setLoading(false);
        });
    } else if (globalCountriesData) {
      setCountries(globalCountriesData);
      setLoading(false);
    }

    // Clean up
    return () => {
      listeners = listeners.filter((listener) => listener !== updateCountries);
    };
  }, []);

  return { countries, loading, error };
};
