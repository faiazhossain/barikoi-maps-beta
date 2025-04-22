// // hooks/useCountries.ts
// import { useEffect, useState } from 'react';
// import outputWithFlags from '@/data/output_with_flags.json';

// interface Country {
//   name: string;
//   iso: string;
//   flag: string;
// }

// export const useCountries = () => {
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     try {
//       // Process the GeoJSON data
//       const countryData = outputWithFlags.features.map((feature: any) => ({
//         name: feature.properties.ADMIN,
//         iso: feature.properties.ISO_A2,
//         flag: feature.properties.flag_image,
//       }));

//       setCountries(countryData);
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to load country data');
//       setLoading(false);
//       console.error('Error loading countries:', err);
//     }
//   }, []);

//   return { countries, loading, error };
// };
