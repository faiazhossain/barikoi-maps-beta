import { useState, useEffect } from 'react';
import axios from 'axios';

interface ImageData {
  key: string;
  url: string;
}

export const useImageUrls = (images: ImageData[]) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        setIsLoading(true);
        const headers = { Authorization: `Bearer MjYyMzpHOVkzWFlGNjZG` };

        const responses = await Promise.all(
          images.map((image) =>
            axios.get<{ url: string }>(
              `https://api.admin.barikoi.com/api/v2/get-place-image-url-without-auth?key=${image.key}`,
              { headers }
            )
          )
        );
        const urls = responses.map((response) => response.data.url);
        setImageUrls(urls);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch image URLs'
        );
      } finally {
        setIsLoading(false); // Always set loading to false
      }
    };

    if (images?.length) {
      fetchImageUrls();
    } else {
      setIsLoading(false); // Fix: Handle empty images immediately
      setImageUrls([]); // Clear URLs if no images provided
    }

    const refreshInterval = setInterval(() => {
      if (images?.length) {
        fetchImageUrls();
      }
    }, 45 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [images]);

  return { imageUrls, isLoading, error };
};
