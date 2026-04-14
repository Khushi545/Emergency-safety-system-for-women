"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface IncidentClusterMapProps {
  alerts: any[];
}

export default function IncidentClusterMap({ alerts }: IncidentClusterMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[400px] bg-gray-100 animate-pulse rounded-2xl" />;

  const validAlerts = alerts.filter(a => a.latitude && a.longitude);
  const center: [number, number] = validAlerts.length > 0 
    ? [validAlerts[0].latitude, validAlerts[0].longitude] 
    : [20.5937, 78.9629]; // India center as default

  return (
    <div className="bg-white p-4 rounded-2xl border border-card-border shadow-sm overflow-hidden h-[450px]">
      <h3 className="font-bold text-text-primary mb-4 px-2">Incident Location Map</h3>
      <div className="h-full w-full rounded-xl overflow-hidden grayscale-[0.5] hover:grayscale-0 transition-all duration-500">
        <MapContainer 
          center={center} 
          zoom={5} 
          scrollWheelZoom={false} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup>
            {validAlerts.map((alert) => (
              <Marker 
                key={alert.id} 
                position={[alert.latitude, alert.longitude]}
              >
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <div className="font-bold text-primary mb-1">Emergency Alert</div>
                    <div className="text-xs text-text-secondary mb-2">
                       {alert.timestamp?.toDate 
                        ? format(alert.timestamp.toDate(), "MMM dd, yyyy HH:mm")
                        : alert.timestamp ? format(new Date(alert.timestamp), "MMM dd, yyyy HH:mm") : "N/A"}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold text-white ${
                        alert.status === "active" ? "bg-secondary" : "bg-accent-resolved"
                      }`}>
                        {alert.status}
                      </span>
                      {alert.duration && (
                        <span className="text-[10px] text-text-secondary">
                          {Math.round(alert.duration / 60000)}m
                        </span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}
