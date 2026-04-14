"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { History, ShieldAlert, Search } from "lucide-react";
import AlertHistoryCard from "@/components/AlertHistoryCard";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const alertsQuery = query(
      collection(db, "alerts"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlerts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredAlerts = alerts.filter(alert => 
    filter === "all" ? true : alert.status === filter
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Alert History</h1>
          <p className="text-text-secondary">Review your past security alerts and evidence.</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-card-border shadow-sm">
          {(["all", "active", "resolved"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all",
                filter === t ? "bg-primary text-white shadow-md shadow-primary/20" : "text-text-secondary hover:text-primary"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <AlertHistoryCard alert={alert} />
              </motion.div>
            ))
          ) : !loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-card-border shadow-sm">
              <div className="p-4 bg-primary-light rounded-full mb-4">
                <History size={48} className="text-primary opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">No alerts found</h3>
              <p className="text-text-secondary">Your safety record is clean. Stay safe!</p>
            </div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white border border-card-border rounded-2xl" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
