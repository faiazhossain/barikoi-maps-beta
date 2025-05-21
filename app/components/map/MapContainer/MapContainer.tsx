"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import maplibregl, { LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapGL, { MapRef, Marker } from "react-map-gl/maplibre";
import { useMapRef } from "../hooks/useMapRef";
import { useRouteFromUrl } from "../hooks/useRouteFromUrl";
import { useMapEventHandlers } from "../hooks/useMapEventHandlers";
import { usePlaceDetailsEffect } from "../hooks/usePlaceDetailsEffect";
import MapControls from "./MapControls";
import BarikoiAttribution from "./BarikoiAttribution";
import MapLayerSwitcher from "./MapLayerSwitcher";
import { AnimatePresence } from "framer-motion";
import InfoCard from "../InfoCard/InfoCard";
import mqtt from "mqtt";

import {
  setMapLoaded,
  setMapStyle,
  setMarkerCoords,
  setViewport,
  setSelectedCountry,
} from "@/app/store/slices/mapSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import ResponsiveDrawer from "../../LeftPanel/ResponsiveDrawer";
import { useUrlParams } from "@/app/hooks/useUrlParams";
import AnimatedMarker from "../Markers/AnimatedMarker";
import MapContextMenu from "../ContextMenu/MapContextMenu";
import ContextMarker from "../Markers/ContextMarker";
import NearbySearchMarker from "../Markers/NearbySearchMarker";
import NearbyPlaceMarker from "../Markers/NearbyPlaceMarker";
import NearbyPlacePopup from "../Popups/NearbyPlacePopup";
import NearbyPlaceModal from "../Modals/NearbyPlaceModal";
import { NearbyPlace } from "@/app/types/map";
import MapillaryLayer from "../Mapillary/MapillaryLayer";
import RouteLayer from "../Layers/RouteLayer";
import RouteMarkers from "../Markers/RouteMarkers";
import {
  findCountryAtPoint,
  findCountryByName,
  calculateBoundingBox,
} from "@/app/utils/geoUtils";
import { addFitCountryListener } from "@/app/utils/eventUtils";
import { setSelectedCountryCode } from "@/app/store/slices/countrySlice";
import { setSearchCenter } from "@/app/store/slices/searchSlice";

const MapContainer: React.FC = () => {
  const mapRef = useMapRef();
  const dispatch = useAppDispatch();
  const { isLeftBarOpen } = useAppSelector((state) => state.drawer);
  const { placeDetails, nearbyPlaces } = useAppSelector(
    (state) => state.search
  );
  const { markerCoords, viewport, mapStyle, showDirections } = useAppSelector(
    (state) => state.map
  );
  const { route, origin, destination } = useAppSelector(
    (state) => state.directions
  );
  const selectedCategories = useAppSelector(
    (state) => state.search.selectedCategories
  );
  const isMapillaryVisible = useAppSelector(
    (state) => state.mapillary.isVisible
  );
  const showNearbyResults = selectedCategories.length > 0;

  // State for user location
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Local state for current map style url
  const [currentMapStyle, setCurrentMapStyle] = useState(
    mapStyle || "/map-styles/light-style.json"
  );

  const { searchCenter } = useAppSelector((state) => state.search);

  // MQTT state
  const [mqttMarkers, setMqttMarkers] = useState<
    Map<
      string,
      {
        deviceId: string;
        latitude: number;
        longitude: number;
        timestamp: number;
        isOnline: boolean;
      }
    >
  >(new Map());
  const mqttClientRef = useRef<any>(null);
  // Time threshold to consider a device offline (10 seconds in milliseconds)
  const OFFLINE_THRESHOLD = 10 * 1000;

  // Function to check if devices are offline
  const checkOfflineDevices = useCallback(() => {
    const now = Date.now();
    setMqttMarkers((prevMarkers) => {
      const newMarkers = new Map(prevMarkers);
      let hasUpdates = false;

      newMarkers.forEach((marker, deviceId) => {
        const timeSinceLastUpdate = now - marker.timestamp;
        const shouldBeOnline = timeSinceLastUpdate < OFFLINE_THRESHOLD;

        if (marker.isOnline !== shouldBeOnline) {
          newMarkers.set(deviceId, {
            ...marker,
            isOnline: shouldBeOnline,
          });
          hasUpdates = true;
        }
      });

      return hasUpdates ? newMarkers : prevMarkers;
    });
  }, []);

  // Set up interval to regularly check for offline devices
  useEffect(() => {
    const intervalId = setInterval(checkOfflineDevices, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, [checkOfflineDevices]);

  // Function to detect country at map center
  const detectCountryAtMapCenter = useCallback(
    async (longitude: number, latitude: number) => {
      try {
        const countryFeature = await findCountryAtPoint(longitude, latitude);
        if (countryFeature) {
          const countryName = countryFeature.properties.ADMIN;
          const countryCode = countryFeature.properties.ISO_A2;

          dispatch(setSelectedCountry(countryName));
          dispatch(setSelectedCountryCode(countryCode));
        } else {
          dispatch(setSelectedCountry(null));
          dispatch(setSelectedCountryCode(null));
        }
      } catch (error) {
        console.error("Error detecting country at map center:", error);
      }
    },
    [dispatch]
  );

  // Effect to detect country on initial mount
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const center = map.getCenter();
      detectCountryAtMapCenter(center.lng, center.lat);
    }
  }, [mapRef, detectCountryAtMapCenter]);

  // Effect to get user's location on component mount
  useEffect(() => {
    // Function to get user's geolocation
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser");
        return;
      }

      setIsLocatingUser(true);

      // Clear any existing values first
      setUserLocation(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Set local state first
          setUserLocation({ latitude, longitude });

          // Detect country at user's location
          try {
            const countryFeature = await findCountryAtPoint(
              longitude,
              latitude
            );
            if (countryFeature) {
              const countryName = countryFeature.properties.ADMIN;
              dispatch(setSelectedCountry(countryName));
            }
          } catch (error) {
            console.error("Error detecting initial country:", error);
          }

          // Update the viewport in Redux store with a slight delay
          setTimeout(() => {
            dispatch(
              setViewport({
                longitude,
                latitude,
                zoom: 13,
              })
            );
          }, 100);

          setIsLocatingUser(false);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setIsLocatingUser(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Increased timeout
          maximumAge: 0,
        }
      );
    };

    // Get user location when component mounts
    getUserLocation();
  }, [dispatch]);

  // Effect to update map when user location changes
  useEffect(() => {
    if (userLocation && mapRef.current) {
      // Only fly to the location if we haven't initialized with it
      if (mapRef.current.getZoom() > 0) {
        mapRef.current.flyTo({
          center: [userLocation.longitude, userLocation.latitude],
          zoom: 13,
          duration: 1000,
        });
      }
    }
  }, [userLocation, mapRef]);

  // Connect to MQTT broker and subscribe to topic
  useEffect(() => {
    if (typeof window === "undefined") return; // Only run on client side

    // Configure MQTT connection options using WebSockets instead of direct MQTT protocol
    const host = "202.72.236.166";
    const port = 8083; // Use WebSocket port instead of direct MQTT port
    const mqttUri = `ws://${host}:${port}/mqtt`; // WebSocket connection URL format

    const options = {
      clientId: `barikoi-maps_${Math.random().toString(16).substring(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    };

    console.log("Connecting to MQTT broker:", mqttUri);

    try {
      // Create MQTT client
      const client = mqtt.connect(mqttUri, options);
      mqttClientRef.current = client;

      // Handle connection
      client.on("connect", () => {
        console.log("MQTT Connected successfully");
        // Subscribe to device location topic
        const topic = "company/65a4b3873d02929363aae653/location";
        client.subscribe(topic, { qos: 0 }, (err) => {
          if (!err) {
            console.log(`Subscribed to ${topic}`);
            // Optionally publish a message to confirm connection
            // client.publish(topic, JSON.stringify({ connected: true }));
          } else {
            console.error("Subscription error:", err);
          }
        });
      });

      // Handle connection errors
      client.on("error", (err) => {
        console.error("MQTT Connection error:", err);
      });

      // Handle connection loss/close
      client.on("close", () => {
        console.log("MQTT Connection closed");
      });

      // Handle connection failure
      client.on("offline", () => {
        console.log("MQTT Client is offline");
      });

      // Handle messages
      client.on("message", (_, message) => {
        try {
          // Parse the incoming message
          const payload = JSON.parse(message.toString());
          console.log("MQTT message received:", payload);

          // Check if payload has location data
          if (payload.latitude && payload.longitude) {
            // Use deviceId from the payload or generate a default one
            const deviceId = payload.deviceId || "unknown-device";

            setMqttMarkers((prevMarkers) => {
              const newMarkers = new Map(prevMarkers);
              newMarkers.set(deviceId, {
                deviceId: deviceId,
                latitude: parseFloat(payload.latitude),
                longitude: parseFloat(payload.longitude),
                timestamp: Date.now(),
                isOnline: true,
              });
              return newMarkers;
            });
          }
        } catch (error) {
          console.error(
            "Error parsing MQTT message:",
            error,
            message.toString()
          );
        }
      });

      // Clean up on component unmount
      return () => {
        if (client) {
          client.unsubscribe("company/65a4b3873d02929363aae653/location");
          client.end(true, () => {
            console.log("MQTT Connection terminated");
          });
        }
      };
    } catch (error) {
      console.error("MQTT Setup error:", error);
    }
  }, []); // Empty dependency array to run only on mount

  // Handle map style change
  const handleMapStyleChange = useCallback(
    (styleUrl: string) => {
      setCurrentMapStyle(styleUrl);
      dispatch(setMapStyle(styleUrl));
    },
    [dispatch]
  );

  // State for selected nearby place popup and modal
  const [selectedNearbyPlace, setSelectedNearbyPlace] =
    useState<NearbyPlace | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Use the custom hooks for event handling
  const {
    hoveredFeatureId,
    selectedFeature,
    handleMapClick,
    handleMouseEnter,
    handleMouseLeave,
    handleMapDoubleClick,
    handleContextMenu,
    contextMenu,
    closeContextMenu,
    setSelectedFeature,
  } = useMapEventHandlers();

  // Add URL params hook
  useUrlParams();

  // Use the route hook with proper typing
  useRouteFromUrl(mapRef as React.RefObject<MapRef>);

  // Handle place details effect
  usePlaceDetailsEffect(placeDetails, mapRef as React.RefObject<MapRef>);

  // Add handler for map move end event
  const handleMoveEnd = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const center = map.getCenter();

      // Update viewport in store
      dispatch(
        setViewport({
          longitude: center.lng,
          latitude: center.lat,
          zoom: map.getZoom(),
        })
      );

      // Detect country at new center position
      detectCountryAtMapCenter(center.lng, center.lat);
    }
  }, [dispatch, mapRef, detectCountryAtMapCenter]);

  const handleMapLoad = () => {
    dispatch(setMapLoaded(true));

    // Access the actual maplibre-gl map instance
    if (mapRef.current) {
      const map = mapRef.current;

      // Also update viewport on initial load
      const { lng: longitude, lat: latitude } = map.getCenter();
      dispatch(
        setViewport({
          longitude,
          latitude,
          zoom: map.getZoom(),
        })
      );
      // Detect country on initial load
      detectCountryAtMapCenter(longitude, latitude);
    }
  };

  // Handle nearby place marker click
  const handleNearbyPlaceClick = (place: NearbyPlace) => {
    setSelectedNearbyPlace(place);
    setShowDetailsModal(false);
  };

  // Close popup
  const handleClosePopup = () => {
    setSelectedNearbyPlace(null);
  };

  // Show details modal
  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowDetailsModal(false);
  };

  // Add event handler to close the context menu when clicking outside
  const handleMapContainerClick = React.useCallback(() => {
    if (contextMenu.visible) {
      closeContextMenu();
    }
  }, [contextMenu.visible, closeContextMenu]);

  const handleCloseInfoCard = React.useCallback(() => {
    setSelectedFeature(null);
    dispatch(setMarkerCoords(null)); // Clear marker coordinates when closing the info card
  }, [setSelectedFeature, dispatch]);

  // Add this helper function for nearby places
  const fitMarkersInView = React.useCallback(() => {
    if (!mapRef.current || !nearbyPlaces.length) return;

    const bounds = new LngLatBounds();

    // Extend bounds to include all nearby places
    nearbyPlaces.forEach((place) => {
      bounds.extend([parseFloat(place.longitude), parseFloat(place.latitude)]);
    });

    // Add some padding to the bounds
    mapRef.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 16,
      duration: 1000,
    });
  }, [nearbyPlaces, mapRef]);

  // Add helper function for route bounds
  const fitRouteBoundsInView = React.useCallback(() => {
    if (!mapRef.current || !route?.bbox || !origin || !destination) return;

    // If we have route bounding box, use that
    if (route.bbox && route.bbox.length === 4) {
      const [west, south, east, north] = route.bbox;

      // Make sure all values are defined before creating bounds
      if (
        typeof west === "number" &&
        typeof south === "number" &&
        typeof east === "number" &&
        typeof north === "number"
      ) {
        const bounds = new LngLatBounds([west, south], [east, north]);

        mapRef.current.fitBounds(bounds, {
          padding: 80,
          maxZoom: 16,
          duration: 1000,
        });
      }
    }
    // Otherwise fit to just origin and destination
    else if (origin && destination) {
      const bounds = new LngLatBounds();
      bounds.extend([origin.longitude, origin.latitude]);
      bounds.extend([destination.longitude, destination.latitude]);

      mapRef.current.fitBounds(bounds, {
        padding: 80,
        maxZoom: 16,
        duration: 1000,
      });
    }
  }, [route, origin, destination, mapRef]);

  // Add useEffect to trigger bounds fitting when nearby places change
  React.useEffect(() => {
    if (showNearbyResults && nearbyPlaces.length > 0) {
      fitMarkersInView();
    }
  }, [showNearbyResults, nearbyPlaces, fitMarkersInView]);
  // Add useEffect to fit route bounds when route changes
  React.useEffect(() => {
    if (showDirections && route) {
      fitRouteBoundsInView();
    }
  }, [showDirections, route, fitRouteBoundsInView]);

  // Function to fit the map to a selected country's bounds
  const fitMapToCountry = useCallback(
    async (countryName: string) => {
      if (!mapRef.current) return;

      try {
        const countryFeature = await findCountryByName(countryName);
        if (countryFeature && countryFeature.geometry) {
          const boundingBox = calculateBoundingBox(countryFeature.geometry);
          const [west, south, east, north] = boundingBox;

          const bounds = new LngLatBounds([west, south], [east, north]);

          mapRef.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 10,
            duration: 1000,
          });
        }
      } catch (error) {
        console.error("Error fitting map to country:", error);
      }
    },
    [mapRef]
  );
  // Add useEffect to set up listener for country selection events
  useEffect(() => {
    // Add listener for fit country events
    const removeListener = addFitCountryListener((countryName) => {
      fitMapToCountry(countryName);
    });

    // Clean up listener on unmount
    return () => {
      removeListener();
    };
  }, [fitMapToCountry]);

  // Initialize search center when nearby search is first activated
  useEffect(() => {
    if (showNearbyResults && !searchCenter) {
      setSearchCenter({
        latitude: viewport.latitude,
        longitude: viewport.longitude,
      });
    } else if (!showNearbyResults) {
      setSearchCenter(null);
    }
  }, [showNearbyResults, viewport, searchCenter]);

  return (
    <>
      <div onClick={handleMapContainerClick}>
        {" "}
        <MapGL
          ref={mapRef as unknown as React.RefObject<MapRef>}
          mapLib={maplibregl}
          initialViewState={{
            longitude: userLocation?.longitude || viewport.longitude || 90.3938, // Dhaka fallback
            latitude: userLocation?.latitude || viewport.latitude || 23.8103, // Dhaka fallback
            zoom: userLocation ? 13 : viewport.zoom || 12,
          }}
          style={{ width: "100vw", height: "100dvh" }}
          mapStyle={currentMapStyle || "/map-styles/light-style.json"}
          attributionControl={false}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onDblClick={handleMapDoubleClick}
          onContextMenu={handleContextMenu}
          onMoveEnd={handleMoveEnd}
          interactiveLayerIds={[
            "recreation",
            "commercial",
            "residential",
            "education",
            "health",
            "government",
            "religious",
            "mapillary-images",
            "mapillary-sequences",
          ]}
          cursor={hoveredFeatureId ? "pointer" : "default"}
          hash={true}
        >
          <MapControls /> <BarikoiAttribution />
          {isLeftBarOpen && !isMapillaryVisible && <ResponsiveDrawer />}{" "}
          {/* Display locating indicator when trying to get user location */}
          {isLocatingUser && !userLocation && !isMapillaryVisible && (
            <div className='absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md flex items-center space-x-2 z-10'>
              <div className='w-4 h-4 rounded-full bg-blue-500 animate-ping'></div>
              <span className='text-sm font-medium'>Locating you...</span>
            </div>
          )}
          {/* Display directions route and markers */}
          {showDirections && !isMapillaryVisible && (
            <>
              <RouteLayer />
              <RouteMarkers />
            </>
          )}
          {/* Display regular marker if we have coordinates and not in directions or nearby mode */}
          {!showNearbyResults &&
            !showDirections &&
            markerCoords &&
            !isMapillaryVisible && (
              <AnimatedMarker
                latitude={markerCoords.latitude}
                longitude={markerCoords.longitude}
                properties={markerCoords.properties}
              />
            )}
          {/* Add nearby search center marker and results */}
          {showNearbyResults && !isMapillaryVisible && searchCenter && (
            <>
              <NearbySearchMarker
                latitude={searchCenter.latitude}
                longitude={searchCenter.longitude}
                categories={selectedCategories}
              />

              {/* Display nearby place markers */}
              {nearbyPlaces.map((place) => (
                <NearbyPlaceMarker
                  key={place.id}
                  place={place as NearbyPlace}
                  onClick={handleNearbyPlaceClick}
                />
              ))}

              {/* Display popup for selected nearby place */}
              {selectedNearbyPlace && (
                <NearbyPlacePopup
                  place={selectedNearbyPlace}
                  onClose={handleClosePopup}
                  onViewDetails={handleViewDetails}
                />
              )}
            </>
          )}
          {/* Context menu marker and popup */}
          {contextMenu.visible && contextMenu.lngLat && !isMapillaryVisible && (
            <>
              <ContextMarker
                longitude={contextMenu.lngLat.lng}
                latitude={contextMenu.lngLat.lat}
              />
              <MapContextMenu
                longitude={contextMenu.lngLat.lng}
                latitude={contextMenu.lngLat.lat}
                onClose={closeContextMenu}
              />
            </>
          )}
          {/* Updated MapillaryLayer - no props needed */}
          <MapillaryLayer />
          {/* Add the Map Layer Switcher */}
          <MapLayerSwitcher
            onStyleChange={handleMapStyleChange}
            currentStyleUrl={currentMapStyle}
          />
          {/* MQTT Device Location Markers */}
          {Array.from(mqttMarkers.values()).map((marker) => (
            <Marker
              key={marker.deviceId}
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor='bottom'
            >
              <div className='relative'>
                {/* Pulsing effect for real-time tracking */}
                <div className='absolute -top-2 -left-2 w-8 h-8 rounded-full bg-blue-400 opacity-30 animate-ping'></div>

                {/* Device marker */}
                <div className='relative z-10 flex items-center justify-center w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md transform-gpu'>
                  <div className='w-1 h-1 bg-white rounded-full'></div>
                </div>
              </div>

              {/* Label for the device with device ID */}
              <div
                className={`absolute -mt-8 ${
                  marker.isOnline ? "bg-green-400" : "bg-red-400"
                } px-1 py-0.5 rounded-md shadow-md text-xs font-medium whitespace-nowrap border border-gray-100`}
              >
                {marker.deviceId}
              </div>
            </Marker>
          ))}
        </MapGL>
        {!isMapillaryVisible && (
          <AnimatePresence>
            {selectedFeature && !selectedFeature.properties?.place_code && (
              <InfoCard
                feature={selectedFeature}
                onClose={handleCloseInfoCard}
              />
            )}
          </AnimatePresence>
        )}
        {/* Details modal */}
        {!isMapillaryVisible && (
          <AnimatePresence>
            {showDetailsModal && selectedNearbyPlace && (
              <NearbyPlaceModal
                place={selectedNearbyPlace}
                onClose={handleCloseModal}
              />
            )}
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default MapContainer;
