"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import SOSAreaChart from "@/components/analytics/SOSAreaChart";
import StatusDonutChart from "@/components/analytics/StatusDonutChart";
import HourlyBarChart from "@/components/analytics/HourlyBarChart";
import WeeklyBarChart from "@/components/analytics/WeeklyBarChart";
import AlertHeatmap from "@/components/analytics/AlertHeatmap";
import AlertTimeline from "@/components/analytics/AlertTimeline";
import AnalyticsSubNav from "@/components/analytics/AnalyticsSubNav";
import DateRangePicker from "@/components/analytics/DateRangePicker";
import ExportButton from "@/components/analytics/ExportButton";

export default function AnalyticsOverview() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Mock data for initial "Full" look matching screenshots
      const mockTimeSeries = [
        { date: "3/15", alerts: 3, resolved: 3 },
        { date: "3/16", alerts: 5, resolved: 4 },
        { date: "3/17", alerts: 4, resolved: 3 },
        { date: "3/18", alerts: 6, resolved: 5 },
        { date: "3/19", alerts: 3, resolved: 3 },
        { date: "3/20", alerts: 7, resolved: 6 },
        { date: "3/21", alerts: 5, resolved: 4 },
        { date: "3/22", alerts: 8, resolved: 7 },
        { date: "3/23", alerts: 4, resolved: 3 },
        { date: "3/24", alerts: 6, resolved: 5 },
        { date: "3/25", alerts: 3, resolved: 3 },
        { date: "3/26", alerts: 7, resolved: 6 },
        { date: "3/27", alerts: 9, resolved: 8 },
        { date: "3/28", alerts: 6, resolved: 5 },
        { date: "3/29", alerts: 4, resolved: 3 },
        { date: "4/1", alerts: 8, resolved: 7 },
        { date: "4/3", alerts: 5, resolved: 4 },
        { date: "4/4", alerts: 6, resolved: 5 },
        { date: "4/5", alerts: 3, resolved: 3 },
        { date: "4/7", alerts: 7, resolved: 6 },
        { date: "4/8", alerts: 8, resolved: 7 },
        { date: "4/9", alerts: 5, resolved: 4 },
        { date: "4/10", alerts: 9, resolved: 8 },
        { date: "4/11", alerts: 6, resolved: 5 },
      ];

      const mockHeatmap = Array.from({ length: 7 }, () => 
        Array.from({ length: 24 }, () => Math.floor(Math.random() * 5))
      );

      const mockAlerts = [
        { id: "1", locationName: "Mumbai, Andheri W", status: "active", timestamp: { toDate: () => new Date() }, contactsCount: 2 },
        { id: "2", locationName: "Mumbai, Bandra", status: "resolved", timestamp: { toDate: () => new Date(Date.now() - 3600000 * 2) }, contactsCount: 3, evidenceCount: 1 },
        { id: "3", locationName: "Mumbai, Dadar", status: "active", timestamp: { toDate: () => new Date(Date.now() - 3600000 * 3) }, contactsCount: 2 },
        { id: "4", locationName: "Mumbai, Powai", status: "resolved", timestamp: { toDate: () => new Date(Date.now() - 3600000 * 4) }, contactsCount: 1, evidenceCount: 1 },
        { id: "5", locationName: "Mumbai, Thane", status: "resolved", timestamp: { toDate: () => new Date(Date.now() - 3600000 * 24) }, contactsCount: 3 },
      ];

      setSummary({
        timeSeries: mockTimeSeries,
        heatmap: mockHeatmap,
        activeAlerts: 2,
        totalAlerts: 48,
        statusData: [
          { name: "Active", value: 7 },
          { name: "Resolved", value: 93 }
        ]
      });
      setAlerts(mockAlerts);
      setLoading(false);

      // Real-time listener (optional overlay for live data)
      const q = query(
        collection(db, "alerts"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(10)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const liveAlerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAlerts(liveAlerts);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-text-secondary font-medium">Initializing StaySafe Security...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 lg:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Security Analytics</h1>
          <p className="text-text-secondary">Comprehensive insights into your safety ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker onRangeChange={() => {}} />
          <ExportButton data={alerts} chartRef={chartRef} filename="security-report" />
        </div>
      </div>

      <AnalyticsSubNav />

      <div ref={chartRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Row 1 */}
        <SOSAreaChart data={summary?.timeSeries || []} />
        <StatusDonutChart data={summary?.statusData || []} />

        {/* Row 2 */}
        <HourlyBarChart data={[]} />
        <WeeklyBarChart data={[]} />

        {/* Row 3 */}
        <div className="lg:h-[450px]">
          <AlertHeatmap data={summary?.heatmap || []} />
        </div>
        <div className="lg:h-[450px]">
          <AlertTimeline alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
