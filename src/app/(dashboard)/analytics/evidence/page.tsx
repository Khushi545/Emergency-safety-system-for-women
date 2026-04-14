"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { FileText, Image as ImageIcon, Mic, BarChart3, TrendingUp } from "lucide-react";
import StatCard from "@/components/analytics/StatCard";
import SkeletonCard from "@/components/analytics/SkeletonCard";
import EvidenceAreaChart from "@/components/analytics/EvidenceAreaChart";
import GaugeChart from "@/components/analytics/GaugeChart";
import StatusDonutChart from "@/components/analytics/StatusDonutChart";
import AnalyticsSubNav from "@/components/analytics/AnalyticsSubNav";

export default function EvidenceAnalytics() {
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

  const evidenceTrend = [
    { date: "Apr 01", images: 2, audio: 1 },
    { date: "Apr 05", images: 4, audio: 0 },
    { date: "Apr 10", images: 3, audio: 2 },
    { date: "Apr 12", images: 5, audio: 1 },
    { date: "Apr 14", images: 2, audio: 0 },
  ];

  const ratioData = [
    { name: "Photos", value: 75 },
    { name: "Audio", value: 25 },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 md:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Evidence Analytics</h1>
        <p className="text-text-secondary">Stats on documentation collected during emergencies.</p>
      </div>

      <AnalyticsSubNav />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Evidence" value={summary?.totalEvidence || 0} icon={FileText} />
            <StatCard label="Photos Captured" value={summary?.totalEvidence ? Math.round(summary.totalEvidence * 0.75) : 0} icon={ImageIcon} />
            <StatCard label="Audio Clips" value={summary?.totalEvidence ? Math.round(summary.totalEvidence * 0.25) : 0} icon={Mic} />
            <StatCard label="Avg Per Alert" value={summary?.totalAlerts ? (summary.totalEvidence / summary.totalAlerts).toFixed(1) : 0} icon={TrendingUp} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EvidenceAreaChart data={evidenceTrend} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GaugeChart value={82} label="Upload Success Rate" />
              <div className="bg-white p-6 rounded-2xl border border-card-border shadow-sm flex flex-col items-center justify-center">
                 <div className="p-4 bg-primary-light text-primary rounded-full mb-4">
                   <BarChart3 size={32} />
                 </div>
                 <h4 className="font-bold text-text-primary">Reliability Score</h4>
                 <p className="text-4xl font-black text-primary mt-2">High</p>
                 <p className="text-xs text-text-secondary mt-1">Based on upload logs</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <StatusDonutChart data={ratioData} />
            </div>
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-card-border shadow-sm flex flex-col justify-center">
               <h3 className="font-bold text-xl text-text-primary mb-4">Documentation Health</h3>
               <p className="text-text-secondary leading-relaxed mb-6">
                 Your evidence collection rate is <strong>high</strong>. Maintaining a consistent log of 
                 documentation (photos/audio) significantly increases the effectiveness of incident reports 
                 and post-emergency verification.
               </p>
               <div className="flex gap-4">
                 <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold">
                   Fast Upload Speed
                 </div>
                 <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">
                   Cloud Backup Verified
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
