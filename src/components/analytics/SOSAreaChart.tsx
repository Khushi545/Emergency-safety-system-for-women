"use client";

import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CHART_COLORS } from '@/lib/chart-theme';

interface SOSAreaChartProps {
  data: any[];
}

export default function SOSAreaChart({ data }: SOSAreaChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-3xl border border-card-border shadow-sm flex flex-col h-[400px]"
    >
      <div className="mb-4">
        <h3 className="font-bold text-lg text-text-primary">SOS alerts over time</h3>
        <p className="text-xs text-text-secondary">Daily count · last 30 days</p>
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              minTickGap={30}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              verticalAlign="top" 
              align="left" 
              iconType="square"
              iconSize={10}
              wrapperStyle={{ paddingTop: 0, paddingBottom: 20, fontSize: '12px', fontWeight: 600, color: '#64748b' }}
            />
            <Area 
              name="Alerts"
              type="monotone" 
              dataKey="alerts" 
              stroke={CHART_COLORS.primary} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorAlerts)" 
              animationDuration={2000}
            />
            <Area 
              name="Resolved"
              type="monotone" 
              dataKey="resolved" 
              stroke={CHART_COLORS.secondary} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorResolved)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
