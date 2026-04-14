"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-theme";
import { motion } from "framer-motion";

interface EvidenceAreaChartProps {
  data: any[];
  height?: number;
}

export default function EvidenceAreaChart({ data, height = 300 }: EvidenceAreaChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white p-6 rounded-2xl border border-card-border shadow-sm"
    >
      <h3 className="font-bold text-text-primary mb-6">Evidence Uploads Over Time</h3>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorImages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAudio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: "12px", 
                border: "none", 
                boxShadow: "0 10px 15px -3px rgba(155, 127, 212, 0.15)",
                padding: "12px"
              }}
            />
            <Area 
              type="monotone" 
              dataKey="images" 
              stackId="1"
              stroke={CHART_COLORS.secondary} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorImages)" 
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="audio" 
              stackId="1"
              stroke={CHART_COLORS.primary} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorAudio)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
