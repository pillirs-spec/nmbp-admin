import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LocationMap.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  latitude: string;
  longitude: string;
  setLatitude: (lat: string) => void;
  setLongitude: (lng: string) => void;
  selectedDistrictName?: string;
  selectedStateName?: string;
}

// Component to handle map updates using useMap hook
const MapUpdater: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 13, { animate: true, duration: 1.5 });
  }, [map, position]);

  return null;
};

const LocationMap: React.FC<Props> = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  selectedDistrictName = "",
  selectedStateName = "",
}) => {
  const [position, setPosition] = useState<[number, number]>([
    parseFloat(latitude),
    parseFloat(longitude),
  ]);

  // Update position when latitude/longitude props change
  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    console.log("LocationMap received props:", {
      latitude,
      longitude,
      parsedLat: lat,
      parsedLng: lng,
    });
    if (!isNaN(lat) && !isNaN(lng)) {
      console.log("Updating position to:", [lat, lng]);
      setPosition([lat, lng]);
    }
  }, [latitude, longitude]);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      );

      const data = await res.json();

      // Log the geocoded data for reference, but don't update district state
      const district =
        data.address.county ||
        data.address.city_district ||
        data.address.state_district ||
        "";

      console.log("Reverse geocoded district:", district);
    } catch (error) {
      console.log(error);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        setPosition([lat, lng]);
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));

        reverseGeocode(lat, lng);
      },
    });

    return <Marker position={position} icon={markerIcon} />;
  };

  return (
    <MapContainer center={position} zoom={13} className="map-container">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater position={position} />
      <MapClickHandler />
    </MapContainer>
  );
};

export default LocationMap;
