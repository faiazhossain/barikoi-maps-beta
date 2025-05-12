/**
 * Event for fitting the map to a country boundary
 */
export const FIT_COUNTRY_EVENT = 'fit-country-event';

export interface FitCountryEventData {
  countryName: string;
}

/**
 * Dispatch an event to fit the map to a country
 */
export function dispatchFitCountryEvent(countryName: string): void {
  const event = new CustomEvent<FitCountryEventData>(FIT_COUNTRY_EVENT, {
    detail: { countryName },
    bubbles: true,
  });
  document.dispatchEvent(event);
}

/**
 * Listen for fit country events
 */
export function addFitCountryListener(
  callback: (countryName: string) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<FitCountryEventData>;
    callback(customEvent.detail.countryName);
  };

  document.addEventListener(FIT_COUNTRY_EVENT, handler);

  // Return a cleanup function to remove the listener
  return () => {
    document.removeEventListener(FIT_COUNTRY_EVENT, handler);
  };
}
