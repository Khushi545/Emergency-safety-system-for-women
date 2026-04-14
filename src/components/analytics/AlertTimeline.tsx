"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AlertTimelineProps {
  alerts: any[];
}

export default function AlertTimeline({ alerts }: AlertTimelineProps) {
  // Mock locations for demo if coordinates are present but no city name
  const getLocationName = (alert: any) => {
    if (alert.locationName) return alert.locationName;
    // For demo/mock purposes matching screenshot
    const locations = ["Mumbai, Andheri W", "Mumbai, Bandra", "Mumbai, Dadar", "Mumbai, Powai", "Mumbai, Thane", "Mumbai, Kurla"];
    return locations[Math.abs(alert.id?.charCodeAt(0) || 0) % locations.length];
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-card-border shadow-sm h-full flex flex-col">
      <h3 className="font-bold text-lg text-text-primary mb-6">Recent alert timeline</h3>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
        {alerts.length === 0 ? (
          <div className="text-center py-10 text-text-secondary italic">
            No alerts recorded yet.
          </div>
        ) : (
          alerts.map((alert, i) => (
            <motion.div
              key={alert.id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 group"
            >
              {/* Dot */}
              <div className={cn(
                "w-2.5 h-2.5 rounded-full mt-1.5 shrink-0",
                alert.status === "active" ? "bg-secondary" : "bg-emerald-400"
              )} />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-sm text-text-primary">
                    {getLocationName(alert)}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                    alert.status === "active" ? "bg-secondary-light text-secondary" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {alert.status}
                  </span>
                </div>
                
                <div className="text-xs text-text-secondary">
                  {alert.timestamp?.toDate 
                    ? format(alert.timestamp.toDate(), "eeee hh:mm a")
                    : alert.timestamp ? format(new Date(alert.timestamp), "eeee hh:mm a") : "Today 11:42 PM"}
                  {" · "}
                  <span>
                    {alert.contactsCount || 2} contacts notified
                    {alert.evidenceCount > 0 && ` · ${alert.evidenceCount} ${alert.evidenceCount === 1 ? 'photo' : 'items'}`}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
