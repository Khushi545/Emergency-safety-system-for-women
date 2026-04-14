"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Next.js/Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { animate: true, duration: 2 });
  }, [lat, lng, map]);
  return null;
}

export default function LiveLocationMap({ lat, lng, isLive = false }: { lat: number, lng: number, isLive?: boolean }) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-card-border shadow-inner">
      <MapContainer 
        center={[lat, lng]} 
        zoom={15} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={icon}>
          <Popup>
            {isLive ? "User's Current Location" : "Alert Location"}
          </Popup>
        </Marker>
        {isLive && <RecenterMap lat={lat} lng={lng} />}
      </MapContainer>
    </div>
  );
}
