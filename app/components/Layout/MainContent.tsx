import { useAppSelector } from "@/app/store/store";
import SearchBar from "../search/components/SearchBar/SearchBar";
import NearbyCategories from "../search/components/NearbyCategories/NearbyCategories";
import MobileAppLink from "../common/TopPanel/MobileAppLink";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("../map/MapContainer/MapContainer"), {
  ssr: false,
});

const MainContent = () => {
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);

  return (
    <main className="relative w-full h-screen">
      <MobileAppLink />
      <MapContainer />
      <div
        className={`absolute ${
          isVisible ? `top-[53px] sm:top-0` : `top-2`
        } left-0 w-full flex flex-row flex-wrap justify-center z-10 gap-6`}
      >
        <SearchBar />
        <NearbyCategories />
      </div>
    </main>
  );
};

export default MainContent;
