"use client";

import { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";
import { firestore } from "../config/firebase";
import LoadingSpinner from "./LoadingSpinner";
import ErrorLoadingSpinner from "./ErrorLoading";
import { collection, onSnapshot } from "firebase/firestore";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 7.8731,
  lng: 80.7718,
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [vehicleIcon, setVehicleIcon] = useState({
    url: "/vehicleIcon.png",
    scaledSize: null,
  });

  const [data, setData] = useState([]);
  const [vehiclePosition, setVehiclePosition] = useState(center); // Initialize with default center
  const [pathCoordinates, setPathCoordinates] = useState([]); // Store coordinates for the polyline

  useEffect(() => {
    if (isLoaded) {
      // Set the vehicle icon size
      setVehicleIcon((prevIcon) => ({
        ...prevIcon,
        scaledSize: new window.google.maps.Size(40, 40),
      }));

      // Reference to the Firestore subcollection
      const vehicleId = "3MlPDEStfBZvXo6g6gFN"; // Replace with the actual vehicle ID
      const gpsLocationRef = collection(
        firestore,
        `Vehicles/${vehicleId}/GPS_locations`
      );

      // Listen for real-time updates
      const unsubscribe = onSnapshot(
        gpsLocationRef,
        (querySnapshot) => {
          const items = [];
          const coordinates = []; // Store coordinates for the polyline
          querySnapshot.forEach((doc) => {
            const locationData = doc.data();
            items.push({ id: doc.id, ...locationData });

            // Add coordinates to the path
            if (locationData.coordinates) {
              coordinates.push({
                lat: locationData.coordinates.latitude,
                lng: locationData.coordinates.longitude,
              });

              // Update the vehicle position with the latest coordinates
              setVehiclePosition({
                lat: locationData.coordinates.latitude,
                lng: locationData.coordinates.longitude,
              });
            }
          });
          setData(items);
          setPathCoordinates(coordinates); // Update the path coordinates
        },
        (error) => {
          console.error("Error fetching GPS locations:", error);
        }
      );

      // Clean up the listener on unmount
      return () => unsubscribe();
    }
  }, [isLoaded]); 

  if (loadError) return <ErrorLoadingSpinner />;
  if (!isLoaded) return <LoadingSpinner />;

  return (
    <div className="flex w-full h-[calc(100vh-164px)] rounded-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={vehiclePosition} // Center the map on the vehicle's position
      >
        {/* Render the vehicle's position as a Marker with a custom icon */}
        {vehicleIcon.scaledSize && (
          <Marker icon={vehicleIcon} position={vehiclePosition} />
        )}

        {/* Render the path as a Polyline */}
        {pathCoordinates.length > 1 && (
          <Polyline
            path={pathCoordinates}
            options={{
              strokeColor: "#FF0000", // Red color
              strokeOpacity: 1.0,
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;