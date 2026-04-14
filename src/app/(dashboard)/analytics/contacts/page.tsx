"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { Users, UserCheck, Mail, Send } from "lucide-react";
import StatCard from "@/components/analytics/StatCard";
import SkeletonCard from "@/components/analytics/SkeletonCard";
import ContactReachChart from "@/components/analytics/ContactReachChart";
import AnalyticsSubNav from "@/components/analytics/AnalyticsSubNav";
import { motion } from "framer-motion";

export default function ContactAnalytics() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      fetchData(user.uid);
    }
  }, []);

  const fetchData = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/summary?userId=${userId}`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Fetch Data Error", err);
    } finally {
      setLoading(false);
    }
  };

  const reachData = [
    { name: "Email Delivered", value: 85 },
    { name: "SMS Delivered", value: 120 },
    { name: "Failed", value: 5 },
  ];

  const topContacts = [
    { name: "Mom", count: 12, lastNotified: "2 days ago", initials: "M" },
    { name: "Dad", count: 10, lastNotified: "2 days ago", initials: "D" },
    { name: "Sister", count: 8, lastNotified: "5 days ago", initials: "S" },
    { name: "Best Friend", count: 15, lastNotified: "Yesterday", initials: "BF" },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 md:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Contact Analytics</h1>
        <p className="text-text-secondary">Effectiveness of your emergency network.</p>
      </div>

      <AnalyticsSubNav />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Contacts" value={summary?.totalContacts || 0} icon={Users} />
            <StatCard label="Total Notified" value={245} icon={Send} />
            <StatCard label="Success Rate" value={98} icon={UserCheck} suffix="%" />
            <StatCard label="Avg Per Alert" value={3.2} icon={Mail} />
          </div>

          <div className="w-full">
            <ContactReachChart data={reachData} />
          </div>
        </div>
      )}
    </div>
  );
}
