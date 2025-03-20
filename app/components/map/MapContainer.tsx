"use client";
import React, { useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Map, {
  GeolocateControl,
  NavigationControl,
} from "react-map-gl/maplibre";

const MapContainer: React.FC = () => {
  const mapRef = useRef(null);

  return (
    <div className="w-screen h-screen relative">
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          longitude: 90.3938,
          latitude: 23.8103,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://map.barikoi.com/styles/osm-liberty-gp/style.json?key=NDE2NzpVNzkyTE5UMUoy"
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl position="bottom-right" />
      </Map>
    </div>
  );
};

export default MapContainer;
