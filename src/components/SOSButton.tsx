"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SOSButtonProps {
  onTrigger: (location: { lat: number; lng: number } | null) => Promise<void>;
  status: "idle" | "loading" | "sent";
}

export default function SOSButton({ onTrigger, status }: SOSButtonProps) {
  const [ripples, setRipples] = useState<{ id: number }[]>([]);

  const handlePress = async () => {
    if (status !== "idle") return;
    
    // Add ripple
    const id = Date.now();
    setRipples((prev) => [...prev, { id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 2000);

    // Get location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await onTrigger({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        async (error) => {
          console.error("Location error", error);
          await onTrigger(null);
        }
      );
    } else {
      await onTrigger(null);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-80 h-80 bg-secondary rounded-full blur-3xl z-0"
      />

      <div className="relative z-10">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-4 border-secondary/50 -m-2"
            />
          ))}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePress}
          disabled={status !== "idle"}
          className={cn(
            "w-64 h-64 rounded-full shadow-[0_12px_40px_rgba(224,122,170,0.4)] flex flex-col items-center justify-center gap-2 transition-all duration-500 overflow-hidden relative",
            status === "idle" && "bg-gradient-to-br from-secondary to-secondary-dark",
            status === "loading" && "bg-primary-light",
            status === "sent" && "bg-accent-resolved"
          )}
        >
          {status === "idle" && (
            <>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ShieldAlert className="w-16 h-16 text-white mb-2" />
              </motion.div>
              <span className="text-white text-2xl font-bold tracking-wider">SOS</span>
              <span className="text-white/80 text-sm font-medium">TAP TO HELP</span>
            </>
          )}

          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <span className="text-primary font-semibold">Broadcasting Alert...</span>
              <div className="flex items-center gap-1 text-text-secondary text-xs">
                <MapPin className="w-3 h-3" /> Pinpointing Location
              </div>
            </>
          )}

          {status === "sent" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <CheckCircle2 className="w-16 h-16 text-white mb-2" />
              <span className="text-white text-xl font-bold">Alert Sent!</span>
              <span className="text-white/90 text-sm">Contacts Notified</span>
            </motion.div>
          )}
        </motion.button>
      </div>
    </div>
  );
}
