"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import { Property } from "@/data/properties";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Regular default marker icon (like Google Maps)
const createIcon = () => {
  return L.icon({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export interface Property {
  id: number;
  title?: string;
  price?: number;
  lat?: number;
  lng?: number;
  image?: string;
  night_count?: number;
  is_food_available?: boolean;
  is_pets_allowed?: boolean;
  no_of_rooms?: number;
  no_of_guest?: number;
  rating?: number;
  review_count?: number;
  city_name?: string;
  amenities?: { id: number; name: string; image: string }[];
  [key: string]: any;
}
interface PropertyMapProps {
  properties: Property[];
  hoveredId: number | null;
  onHover: (id: number | null) => void;
}

// Fit bounds to all properties with valid coordinates
const FitBounds = ({ properties }: { properties: Property[] }) => {
  const map = useMap();
  useEffect(() => {
    const validProps = properties.filter((p) => p.lat != null && p.lng != null);
    if (validProps.length > 0) {
      const bounds = L.latLngBounds(
        validProps.map((p) => [Number(p.lat), Number(p.lng)]),
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [properties, map]);
  return null;
};

// Listen for external showPropertyMap events and fly the map to that location
const ShowPropertyHandler = ({
  properties,
  markerRefs,
}: {
  properties: Property[];
  markerRefs: React.MutableRefObject<Record<number, L.Marker | null>>;
}) => {
  const map = useMap();

  useEffect(() => {
    const handler = (event: any) => {
      try {
        const detail = event?.detail || {};
        const { lat, lng, propertyId } = detail;
        if (lat == null || lng == null) return;

        const coords: [number, number] = [Number(lat), Number(lng)];

        // Fly to the requested coordinates
        map.flyTo(coords, 15, { animate: true });

        // If we have a marker ref for this property, open its popup so full content shows
        if (propertyId != null && markerRefs?.current?.[propertyId]) {
          const m = markerRefs.current[propertyId];
          try {
            m?.openPopup();
            return;
          } catch (err) {
            // fallback to custom popup below
          }
        }

        // Fallback: create a simple popup at the coords with the property's title
        const prop = properties.find((p) => p.id === propertyId);
        const title = prop?.title || prop?.name || "Property";

        L.popup({ maxWidth: 300 })
          .setLatLng(coords)
          .setContent(`<div style="font-weight:600">${title}</div>`)
          .openOn(map);
      } catch (err) {
        console.error("Error handling showPropertyMap event:", err);
      }
    };

    window.addEventListener("showPropertyMap", handler);
    return () => window.removeEventListener("showPropertyMap", handler);
  }, [map, properties, markerRefs]);

  return null;
};
const PropertyMap = ({ properties, hoveredId, onHover }: PropertyMapProps) => {
  // Use first valid property as center or fallback to Saudi Arabia (Riyadh)
  const validProps = properties.filter((p) => p.lat != null && p.lng != null);
  const markerRefs = useRef<Record<number, L.Marker | null>>({});
  const center: [number, number] =
    validProps.length > 0
      ? [Number(validProps[0].lat), Number(validProps[0].lng)]
      : [24.7136, 46.6753]; // Riyadh, Saudi Arabia

  return (
    <div className="w-full h-[1700px] rounded-xl overflow-hidden shadow-2xl ">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        scrollWheelZoom={true}
        zoomControl={true}
        dragging={true}
      >
        {/* Default OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds properties={validProps} />

        <ShowPropertyHandler properties={validProps} markerRefs={markerRefs} />

        {validProps.map((property, index) => (
          <Marker
            key={property.id}
            position={[Number(property.lat), Number(property.lng)]}
            icon={createIcon()}
            ref={(el: any) => (markerRefs.current[property.id] = el)}
            eventHandlers={{
              mouseover: () => onHover(property.id),
              mouseout: () => onHover(null),
              click: () => onHover(property.id),
            }}
          >
            <Popup closeButton={true} className="property-popup" maxWidth={280}>
              <div className="p-3 space-y-2 rounded-lg">
                {/* Image */}
                <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title */}
                <p className="font-bold text-slate-900 text-sm leading-tight">
                  {property.title}
                </p>

                {/* Location */}
                <p className="text-slate-600 text-xs flex items-center gap-1">
                  📍 {property.city_name}
                </p>

                {/* Rating */}
                {property.rating && (
                  <p className="text-slate-700 text-xs font-semibold flex items-center gap-1">
                    ⭐ {Number(property.rating).toFixed(1)} (
                    {property.review_count} reviews)
                  </p>
                )}

                {/* Features */}
                {(property.no_of_rooms || property.no_of_guest) && (
                  <div className="flex gap-2 text-xs">
                    {property.no_of_rooms && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        🏠 {property.no_of_rooms} Rooms
                      </span>
                    )}
                    {property.no_of_guest && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        👥 {property.no_of_guest} Guests
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-2 rounded-lg border border-amber-200">
                  <p className="font-bold text-amber-900 text-sm">
                    SAR {Number(property.price).toLocaleString()}/
                    {property.night_count
                      ? `${property.night_count} nights`
                      : "night"}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* CSS for popup styling */}
      <style jsx>{`
        :global(.property-popup .leaflet-popup-content-wrapper) {
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
          border: none !important;
          background-color: white !important;
        }

        :global(.property-popup .leaflet-popup-content) {
          margin: 0 !important;
          line-height: 1.4 !important;
          font-family: inherit !important;
        }

        :global(.property-popup .leaflet-popup-tip) {
          background-color: white !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default PropertyMap;
