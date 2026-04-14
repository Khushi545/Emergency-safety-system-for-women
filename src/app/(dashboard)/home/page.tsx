"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import SOSButton from "@/components/SOSButton";
import EvidenceUploader from "@/components/EvidenceUploader";
import { ShieldCheck, Users, MapPin, AlertTriangle, Radio, Phone } from "lucide-react";

export default function HomePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [userName, setUserName] = useState("");
  const [currentAlertId, setCurrentAlertId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName?.split(" ")[0] || "there");
      
      // Fetch contacts for quick calling
      import("@/lib/firebase").then(({ db }) => {
        import("firebase/firestore").then(({ collection, getDocs }) => {
          getDocs(collection(db, "users", user.uid, "contacts")).then(snap => {
            setContacts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          });
        });
      });
    }
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const startTracking = (alertId: string) => {
    if ("geolocation" in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await updateDoc(doc(db, "alerts", alertId), {
              latitude,
              longitude,
              lastUpdated: serverTimestamp(),
            });
          } catch (err) {
            console.error("Update Location Error", err);
          }
        },
        (error) => console.error(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  const handleSOSTrigger = async (location: { lat: number; lng: number } | null) => {
    setStatus("loading");
    const user = auth.currentUser;
    if (!user) return;

    try {
      const alertData = {
        userId: user.uid,
        userName: user.displayName,
        timestamp: serverTimestamp(),
        status: "active",
        latitude: location?.lat || null,
        longitude: location?.lng || null,
        mapsLink: location ? `https://www.google.com/maps?q=${location.lat},${location.lng}` : null,
        evidenceUrls: [],
      };

      const docRef = await addDoc(collection(db, "alerts"), alertData);
      setCurrentAlertId(docRef.id);

      await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId: docRef.id,
          userId: user.uid,
          location,
        }),
      });

      setStatus("sent");
      startTracking(docRef.id);
    } catch (error) {
      console.error("SOS Trigger Error", error);
      setStatus("idle");
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <header className="w-full mb-12 flex flex-col items-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full font-medium text-sm transition-colors duration-500 ${status === "sent" ? "bg-secondary/20 text-secondary-dark" : "bg-accent-resolved/20 text-accent-resolved"
            }`}
        >
          {status === "sent" ? <Radio className="animate-pulse" size={16} /> : <ShieldCheck size={16} />}
          {status === "sent" ? "LIVE ALERT ACTIVE" : "Your protection is active"}
        </motion.div>

        <h1 className="text-4xl font-bold mb-3 text-center">
          {status === "sent" ? "Stay Calm, Help is Coming" : `Hello, ${userName}`}
        </h1>
        <p className="text-text-secondary text-lg text-center max-w-sm">
          {status === "sent"
            ? "Your emergency contacts and nearby help have been notified of your live location."
            : "Tap the button below if you need immediate assistance."}
        </p>
      </header>

      <div className="w-full flex flex-col items-center gap-12">
        <div className="flex items-center justify-center min-h-[320px]">
          <SOSButton onTrigger={handleSOSTrigger} status={status} />
        </div>

        <AnimatePresence>
          {status === "sent" && currentAlertId && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg space-y-6"
            >
              <EvidenceUploader alertId={currentAlertId} />
              
              {contacts.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Call Contacts</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {contacts.map((contact, i) => (
                      <a
                        key={i}
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-3 p-3 bg-white border border-card-border rounded-xl hover:border-primary/50 transition-all group"
                      >
                        <div className="p-2 bg-primary-light text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                          <Phone size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-text-primary truncate">{contact.name}</span>
                          <span className="text-[10px] text-text-secondary truncate">{contact.phone}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => {
                  if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
                  setStatus("idle");
                  setCurrentAlertId(null);
                }}
                className="w-full py-4 bg-white border border-card-border text-text-secondary rounded-2xl font-bold hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                End SOS Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {status === "idle" && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 w-full grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { icon: Users, label: "Contacts", desc: "Instantly notified", color: "bg-blue-50 text-blue-500" },
              { icon: AlertTriangle, label: "Alert Mode", desc: "Instant SMS/Email", color: "bg-orange-50 text-orange-500" },
              { icon: MapPin, label: "Tracking", desc: "Live location ON", color: "bg-purple-50 text-purple-500" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-card-border shadow-sm flex items-start gap-4">
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Emergency Helpline Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 w-full"
          >
            <h2 className="text-xl font-bold mb-6 text-text-primary px-2">Quick Emergency Helplines</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Women Helpline", number: "1091", color: "bg-rose-100 text-rose-600 hover:bg-rose-200" },
                { name: "Police", number: "100", color: "bg-blue-100 text-blue-600 hover:bg-blue-200" },
                { name: "Ambulance", number: "102", color: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200" },
                { name: "Emergency", number: "112", color: "bg-amber-100 text-amber-600 hover:bg-amber-200" },
              ].map((help, i) => (
                <a
                  key={i}
                  href={`tel:${help.number}`}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border border-transparent transition-all hover:scale-105 active:scale-95 shadow-sm ${help.color}`}
                >
                  <Phone size={24} className="mb-2" />
                  <span className="font-bold text-lg">{help.number}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{help.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
