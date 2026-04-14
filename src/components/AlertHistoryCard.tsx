"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Image as ImageIcon,
  Trash2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const LiveLocationMap = dynamic(() => import("./LiveLocationMap"), { ssr: false });

interface AlertHistoryCardProps {
  alert: any;
}

export default function AlertHistoryCard({ alert }: AlertHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState(alert.status);

  const resolveAlert = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, "alerts", alert.id), { status: "resolved" });
      setStatus("resolved");
    } catch (error) {
      console.error("Resolve error", error);
    }
  };

  const deleteEvidence = async (evidenceItem: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this evidence?")) return;
    
    try {
      await updateDoc(doc(db, "alerts", alert.id), {
        evidenceUrls: arrayRemove(evidenceItem)
      });
      // The component will re-render if its parent passes updated alert data, 
      // otherwise we might need local state for the evidence grid.
      // Assuming parent onSnapshot handles this.
    } catch (error) {
      console.error("Delete evidence error", error);
    }
  };

  const formattedDate = alert.timestamp?.toDate
    ? alert.timestamp.toDate().toLocaleString()
    : new Date(alert.timestamp).toLocaleString();

  return (
    <motion.div
      layout
      className="bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden flex flex-col hover:border-primary/30 transition-all duration-300"
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500",
            status === "active" ? "bg-secondary/20 text-secondary-dark animate-pulse" : "bg-accent-resolved/20 text-accent-resolved"
          )}>
            {status === "active" ? <Clock size={24} /> : <CheckCircle size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-text-primary">Emergency Alert</h3>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                status === "active" ? "bg-secondary text-white" : "bg-accent-resolved text-white"
              )}>
                {status}
              </span>
            </div>
            <p className="text-xs text-text-secondary flex items-center gap-1">
              <Calendar size={12} /> {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {status === "active" && (
            <button
              onClick={resolveAlert}
              className="px-4 py-2 bg-accent-resolved text-white text-xs font-bold rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md shadow-accent-resolved/20"
            >
              Resolve
            </button>
          )}
          {isExpanded ? <ChevronUp className="text-text-secondary" /> : <ChevronDown className="text-text-secondary" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-card-border"
          >
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Location</h4>
                    <div className="flex items-start gap-2 text-sm text-text-primary">
                      <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        {alert.latitude && alert.longitude 
                          ? `${alert.latitude.toFixed(6)}, ${alert.longitude.toFixed(6)}`
                          : "Location not captured"}
                        {alert.mapsLink && (
                          <a 
                            href={alert.mapsLink} 
                            target="_blank" 
                            className="block text-primary hover:underline mt-1 font-medium flex items-center gap-1"
                          >
                            Google Maps <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Contacts Notified</h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.contactsNotified?.map((name: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">
                          {name}
                        </span>
                      )) || <span className="text-xs text-text-secondary italic">No contacts listed</span>}
                    </div>
                  </div>
                </div>

                <div className="h-48 relative">
                   {alert.latitude && alert.longitude && (
                     <LiveLocationMap lat={alert.latitude} lng={alert.longitude} />
                   )}
                </div>
              </div>

              {alert.evidenceUrls && alert.evidenceUrls.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Collected Evidence</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {alert.evidenceUrls.filter((item: any) => item.type === "image").map((item: any, i: number) => (
                      <div 
                        key={i} 
                        className="bg-background rounded-xl border border-card-border overflow-hidden relative group"
                      >
                        <div className="aspect-square relative flex items-center justify-center">
                          <img src={item.url} alt="Evidence" className="w-full h-full object-cover" />
                          <a 
                            href={item.url} 
                            target="_blank" 
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          >
                            <ExternalLink size={20} />
                          </a>
                        </div>
                        
                        <button
                          onClick={(e) => deleteEvidence(item, e)}
                          className="absolute top-1 right-1 p-1.5 bg-white/80 hover:bg-white text-secondary-dark rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="Delete Evidence"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
