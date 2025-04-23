'use client';

import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';
import { store } from './store/store';
import SearchBar from './components/search/components/SearchBar';
import NearbyCategories from './components/search/components/NearbyCategories';

const MapContainer = dynamic(() => import('./components/map/MapContainer'), {
  ssr: false,
});

export default function Home() {
  return (
    <Provider store={store}>
      <main className="relative w-full h-screen">
        <MapContainer />
        <SearchBar />
        <NearbyCategories />
      </main>
    </Provider>
  );
}
