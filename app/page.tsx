"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { store } from "./store/store";
import SearchBar from "./components/search/components/SearchBar/SearchBar";
import NearbyCategories from "./components/search/components/NearbyCategories/NearbyCategories";

const MapContainer = dynamic(
  () => import("./components/map/MapContainer/MapContainer"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <Provider store={store}>
      <main className="relative w-full h-screen">
        <MapContainer />
        <div className="absolute top-0 left-0 w-full flex flex-row flex-wrap justify-center z-10 gap-6">
          <SearchBar />
          <NearbyCategories />
        </div>
      </main>
    </Provider>
  );
}
