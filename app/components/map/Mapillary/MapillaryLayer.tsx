import React, { useState, useCallback, useEffect, useRef } from "react";
import { Source, Layer, Marker } from "react-map-gl/maplibre";
import { useAppSelector } from "@/app/store/store";
import { useMap } from "react-map-gl/maplibre";
import { MapillaryFeature, MAPILLARY_TILE_URL } from "./MapillaryUtils";
import MapillaryHoverPopup from "./MapillaryHoverPopup";
import MapillaryJSViewer from "./MapillaryJSViewer";
import MapillaryToggleButton from "./MapillaryToggleButton";

const MapillaryLayer: React.FC = () => {
  const isVisible = useAppSelector((state) => state.mapillary.isVisible);
  const { current: map } = useMap();
  const mapillaryLayersAdded = useRef(false);

  // State for hovering and viewer
  const [hoveredFeature, setHoveredFeature] = useState<MapillaryFeature | null>(
    null
  );
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<[number, number] | null>(
    null
  );

  // Handle mouse events for mapillary features
  const handleMouseEnter = useCallback(
    (e: any) => {
      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      const layerId = feature.layer.id;

      // Only show hover effect for image points, not sequences
      if (layerId === "mapillary-images" && !selectedImageId) {
        setHoveredFeature({
          type: "image",
          coordinates: feature.geometry.coordinates,
          properties: feature.properties,
        });
        e.target.getCanvas().style.cursor = "pointer";
      }
    },
    [selectedImageId]
  );

  const handleMouseLeave = useCallback(
    (e: any) => {
      if (!selectedImageId) {
        setHoveredFeature(null);
        e.target.getCanvas().style.cursor = "";
      }
    },
    [selectedImageId]
  );

  // Handle click on mapillary images
  const handleClick = useCallback(
    (e: any) => {
      if (!e.features || e.features.length === 0) return;

      // Check if we have a mapillary-images feature in the clicked features
      const mapillaryFeature = e.features.find(
        (f) => f.layer.id === "mapillary-images"
      );

      if (mapillaryFeature) {
        // Necessary steps to properly prevent propagation in MapLibre
        if (e.originalEvent) {
          e.originalEvent.stopPropagation();
          e.originalEvent.preventDefault();
          e.originalEvent.cancelBubble = true;
          e.originalEvent.returnValue = false;
        }

        // Save the coordinates of the clicked point
        setSelectedPoint(mapillaryFeature.geometry.coordinates);

        // Directly open the viewer when a point is clicked
        setSelectedImageId(mapillaryFeature.properties.id);

        // Clear the hover state to avoid duplicates
        setHoveredFeature(null);

        // Tell MapLibre to stop processing this event for other layers
        if (map) {
          // This is important: mark the event as handled
          map.triggerRepaint();
        }

        return false;
      }
    },
    [map]
  );

  // Clear selected image
  const handleCloseViewer = useCallback(() => {
    setSelectedImageId(null);
    setSelectedPoint(null);
  }, []);

  // Setup and cleanup map event listeners when visibility changes
  useEffect(() => {
    if (!map) return;

    if (isVisible) {
      // Add event listeners when the layer becomes visible
      map.on("mousemove", "mapillary-images", handleMouseEnter);
      map.on("mouseleave", "mapillary-images", handleMouseLeave);
      map.on("click", "mapillary-images", handleClick);

      // Set the layers as added
      mapillaryLayersAdded.current = true;
    }

    // Cleanup function to remove event listeners
    return () => {
      if (mapillaryLayersAdded.current) {
        map.off("mousemove", "mapillary-images", handleMouseEnter);
        map.off("mouseleave", "mapillary-images", handleMouseLeave);
        map.off("click", "mapillary-images", handleClick);
      }
    };
  }, [map, isVisible, handleMouseEnter, handleMouseLeave, handleClick]);

  return (
    <>
      {isVisible && (
        <Source
          id="mapillary"
          type="vector"
          tiles={[MAPILLARY_TILE_URL]}
          minzoom={6}
          maxzoom={14}
        >
          {/* Sequence lines */}
          <Layer
            id="mapillary-sequences"
            type="line"
            source="mapillary"
            source-layer="sequence"
            paint={{
              "line-color": "#05CB63",
              "line-width": 2,
              "line-opacity": 0.8,
            }}
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
          />

          {/* Image points with clear distinguishable styling */}
          <Layer
            id="mapillary-images"
            type="circle"
            source="mapillary"
            source-layer="image"
            paint={{
              "circle-color": "#034748", // Green for normal state
              "circle-radius": 6, // Default radius
              "circle-stroke-width": 2,
              "circle-stroke-color": "#FFFFFF",
              "circle-pitch-alignment": "map",
            }}
          />
        </Source>
      )}

      {/* Marker for the selected point */}
      {isVisible && selectedPoint && (
        <Marker
          longitude={selectedPoint[0]}
          latitude={selectedPoint[1]}
          anchor="center"
        >
          <div
            className="animate-pulse"
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "rgba(203, 107, 5, 1)",
              border: "3px solidrgb(203, 104, 5)",
              boxShadow: "0 0 8px rgba(203, 88, 5, 1)",
            }}
          />
        </Marker>
      )}

      {/* Popup for hovering over Mapillary image points */}
      {isVisible &&
        hoveredFeature &&
        hoveredFeature.type === "image" &&
        !selectedImageId && <MapillaryHoverPopup feature={hoveredFeature} />}

      {/* Open Mapillary JS Viewer directly when an image is selected */}
      {isVisible && selectedImageId && (
        <MapillaryJSViewer
          imageId={selectedImageId}
          onClose={handleCloseViewer}
        />
      )}

      {/* Toggle button for Mapillary layer */}
      <MapillaryToggleButton />
    </>
  );
};

export default MapillaryLayer;
