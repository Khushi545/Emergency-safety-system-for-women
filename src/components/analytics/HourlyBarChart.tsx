"use client";

import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CHART_COLORS } from '@/lib/chart-theme';

interface HourlyBarChartProps {
  data: any[];
}

export default function HourlyBarChart({ data }: HourlyBarChartProps) {
  // Sample data to match screenshot peak danger windows
  const sampleData = [
    { hour: "12a", count: 1 },
    { hour: "2a", count: 0 },
    { hour: "4a", count: 0 },
    { hour: "6a", count: 1 },
    { hour: "8a", count: 2 },
    { hour: "10a", count: 3 },
    { hour: "12p", count: 4 },
    { hour: "2p", count: 5 },
    { hour: "4p", count: 6 },
    { hour: "6p", count: 7 },
    { hour: "8p", count: 12 },
    { hour: "10p", count: 9 },
  ];

  const chartData = data.length > 0 ? data : sampleData;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-3xl border border-card-border shadow-sm flex flex-col h-[350px]"
    >
      <div className="mb-4">
        <h3 className="font-bold text-lg text-text-primary">Alerts by hour</h3>
        <p className="text-xs text-text-secondary">Peak danger windows</p>
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="hour" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              fill={CHART_COLORS.primary} 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
